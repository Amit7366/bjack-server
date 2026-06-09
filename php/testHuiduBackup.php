<?php
date_default_timezone_set('UTC');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

$userId = isset($_GET['user']) ? trim((string) $_GET['user']) : '';
if ($userId === '') {
    http_response_code(400);
    echo json_encode(["error" => "Missing ?user parameter"]);
    exit();
}

$userIdLower = strtolower($userId);

/** Ensure 32 bytes key: 64-hex → bin; else ASCII padded/truncated to 32. */
function makeAes256Key(string $keyRaw): string {
    if (ctype_xdigit($keyRaw) && strlen($keyRaw) === 64) {
        $key = hex2bin($keyRaw);
        if ($key === false) {
            throw new RuntimeException("Invalid hex AES key");
        }
    } else {
        $key = substr($keyRaw, 0, 32);
        $key = str_pad($key, 32, "\0");
    }
    if (strlen($key) !== 32) {
        throw new RuntimeException("AES-256 key must be 32 bytes");
    }
    return $key;
}

/** AES-256-ECB (PKCS7) + Base64 per vendor docs */
function encryptPayload(array $data, string $aesKeyRaw): string {
    $key = makeAes256Key($aesKeyRaw);
    $plaintext = json_encode($data, JSON_UNESCAPED_SLASHES);
    $enc = openssl_encrypt($plaintext, "AES-256-ECB", $key, OPENSSL_RAW_DATA);
    if ($enc === false) {
        throw new RuntimeException("AES-256-ECB encryption failed");
    }
    return base64_encode($enc);
}

function memberBelongsToUser(string $member, string $userIdLower): bool {
    $member = trim($member);
    if ($member === '') {
        return false;
    }

    $parts = explode("_", $member);
    if (count($parts) >= 3 && strtolower($parts[1]) === $userIdLower) {
        return true;
    }

    // Fallback: member id appears as sbm segment (e.g. h037ad_sbm47373_sbm24)
    foreach ($parts as $part) {
        if (strtolower($part) === $userIdLower) {
            return true;
        }
    }

    return false;
}

/* ------ MAIN ------ */

$nowMs = (int) round(microtime(true) * 1000);

/**
 * Incremental window from Node (gameIngestMarker):
 *   GET ?user=sbm47373&from=1710000000000
 * Optional:
 *   &to=1710007200000
 *
 * Defaults: last 2 hours until now.
 */
$to_date = isset($_GET['to']) ? (int) $_GET['to'] : $nowMs;
$defaultFrom = $to_date - (2 * 60 * 60 * 1000);
$from_date = isset($_GET['from']) ? (int) $_GET['from'] : $defaultFrom;

// Safety bounds
$maxWindowMs = 2 * 60 * 60 * 1000;
if ($to_date <= 0) {
    $to_date = $nowMs;
}
if ($from_date > $to_date) {
    $from_date = $to_date - 60_000;
}
if ($from_date < $to_date - $maxWindowMs) {
    $from_date = $to_date - $maxWindowMs;
}
if ($from_date < 0) {
    $from_date = 0;
}

$aesKey = "4b5dd9df7e1f4a1c64c937ba38629c0f";
$customAgencyUid = "0b98f74aa493413ce882a9edef9f9ede";
$url = "https://jsgame.live/game/transaction/list";
$allRecords = [];
$page = 1;
$pageSize = 2000;

do {
    $inner = [
        "timestamp" => (string) $nowMs,
        "agency_uid" => $customAgencyUid,
        "from_date" => (string) $from_date,
        "to_date" => (string) $to_date,
        "page_no" => $page,
        "page_size" => $pageSize,
    ];

    $payload = encryptPayload($inner, $aesKey);
    $outer = [
        "agency_uid" => $customAgencyUid,
        "timestamp" => (string) $nowMs,
        "payload" => $payload,
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($outer));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        http_response_code(502);
        echo json_encode([
            "status" => false,
            "message" => "Vendor request failed: " . $curlError,
        ]);
        exit();
    }

    $resp = json_decode($response, true);
    $records = $resp["payload"]["records"] ?? [];

    if (!is_array($records)) {
        break;
    }

    foreach ($records as $t) {
        $member = (string) ($t["member_account"] ?? "");
        if (!memberBelongsToUser($member, $userIdLower)) {
            continue;
        }

        $allRecords[] = [
            "agency_uid"     => $customAgencyUid,
            "serial_number"  => $t["serial_number"],
            "currency_code"  => "BDT",
            "game_uid"       => $t["game_uid"],
            "member_account" => $member,
            "bet_amount"     => $t["bet_amount"] ?? null,
            "win_amount"     => $t["win_amount"] ?? null,
            "timestamp"      => $t["timestamp"] ?? null,
            "game_round"     => $t["game_round"] ?? null,
        ];
    }

    $hasMore = count($records) === $pageSize;
    $page++;

} while ($hasMore);

header("Content-Type: application/json");
http_response_code(200);

echo json_encode([
    "status" => true,
    "php_time" => gmdate("Y-m-d H:i:s"),
    "message" => "txCron OK @ " . gmdate("Y-m-d H:i:s"),
    "from_date" => $from_date,
    "to_date" => $to_date,
    "user" => $userIdLower,
    "total_records" => count($allRecords),
    "data" => $allRecords,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
