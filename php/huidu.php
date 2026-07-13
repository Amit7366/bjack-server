<?php
date_default_timezone_set('UTC');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

$userId = $_GET['user'] ?? null;
if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing ?user parameter"]);
    exit();
}

/** Same as NEXT_PUBLIC_GAME_PLAYER_PREFIX / game-launch.ts */
$PLAYER_PREFIX = "h94044";

/**
 * Extract member id from either:
 *   - h94044_bkb47700_b  → bkb47700 (middle segment)
 *   - h94044bkb47700     → bkb47700 (after prefix, no underscores)
 */
function extractMemberId(string $member, string $prefix): ?string {
    $member = trim($member);
    if ($member === "") {
        return null;
    }

    // Format A: prefix_id_suffix
    $parts = explode("_", $member);
    if (count($parts) >= 3) {
        return strtolower($parts[1]);
    }

    // Format B: prefix + id (no underscores), e.g. h94044bkb47700
    $prefixLen = strlen($prefix);
    if (stripos($member, $prefix) === 0 && strlen($member) > $prefixLen) {
        return strtolower(substr($member, $prefixLen));
    }

    return null;
}

function memberBelongsToUser(string $member, string $userId, string $prefix): bool {
    $extracted = extractMemberId($member, $prefix);
    return $extracted !== null && $extracted === strtolower(trim($userId));
}

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

/* ------ MAIN ------ */

$nowMs = (int) round(microtime(true) * 1000);

// vendor timezone (UTC+8)
$vendorOffsetHours = 8;

$todayUtc = gmdate("Y-m-d");
// $todayUtc = "2025-10-20";
// $from_date = strtotime($todayUtc . " 00:00:00 UTC") * 1000;
// $to_date   = strtotime($todayUtc . " 23:59:59 UTC") * 1000;

// ✅ New logic: take from 2 hours ago until now (in milliseconds)
$to_date = (int) round(microtime(true) * 1000);
$from_date = $to_date - (2 * 60 * 60 * 1000); // 2 hours in milliseconds

// $agency = "7d343533d514abb11a9afe12b3cd38b6";
// $aesKey = "4107b4a060fd8533b77ce95fcc9e27ec";
$aesKey = "31a9a1ebd48aa0f675a7fde93106802c";
$customAgencyUid = "214391ef6669df671affeb79414d400e";
$url = "https://huidu.bet/game/transaction/list";
$allRecords = [];
$page = 1;
$pageSize = 2000;

do {
    // Prepare the inner payload
    $inner = [
        "timestamp" => (string) $nowMs,
        "agency_uid" => $customAgencyUid,
        "from_date" => (string) $from_date,
        "to_date" => (string) $to_date,
        "page_no" => $page,
        "page_size" => $pageSize,
    ];

    // Encrypt payload and send request
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

    $response = curl_exec($ch);
    curl_close($ch);

    $resp = json_decode($response, true);
    $records = $resp["payload"]["records"] ?? [];

    if (!is_array($records)) {
        break; // stop if invalid response
    }

    // Add current page records
    foreach ($records as $t) {
        $member = (string) ($t["member_account"] ?? "");
        if (!memberBelongsToUser($member, $userId, $PLAYER_PREFIX)) {
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

    // If we got 2000 records, fetch next page
    $hasMore = count($records) === $pageSize;
    $page++;

} while ($hasMore);

header("Content-Type: application/json");
http_response_code(200);

echo json_encode([
    "status" => true,
    "php_time" => gmdate("Y-m-d H:i:s"),
    "message" => "txCron OK @ " . gmdate("Y-m-d H:i:s"),
    "total_records" => count($allRecords),
    "data" => $allRecords,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);