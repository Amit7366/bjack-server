<?php
declare(strict_types=1);

date_default_timezone_set('UTC');
ini_set("display_errors", "1");
ini_set("display_startup_errors", "1");
error_reporting(E_ALL);

/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/
$config = [
    // Vendor
    "vendor_url" => "https://huidu.bet/game/transaction/list",
    "agency_uid" => "214391ef6669df671affeb79414d400e",
    "aes_key"    => "31a9a1ebd48aa0f675a7fde93106802c", // keep secret

    // Time window: ~1 minute lookback (cron every ~5s)
    "lookback_ms" => 1 * 60 * 1000,

    // Paging
    "page_size" => 2000,

    // Ingest
    "ingest_url"   => "https://bkbajiapi.xyz/api/v1/gameRecords-txns/api/transactions/ingest",
    "batch_size"   => 50,
    "delay_ms"     => 500, // delay between batches

    // Marker storage (server-side dedupe)
    "marker_file" => __DIR__ . "/huidu_marker.json",

    // If true, marker is written before sending batches (avoids duplicates on rapid reruns),
    // and reverted if a fatal ingest error occurs.
    "revert_marker_on_fatal_ingest_failure" => true,

    // Optional: require a secret token if calling via HTTP (recommended if hosted)
    // Example call: /huidu_ingest_cron.php?token=YOURTOKEN
    "require_token" => false,
    "token" => "CHANGE_ME",
];

/*
|--------------------------------------------------------------------------
| OPTIONAL HTTP PROTECTION
|--------------------------------------------------------------------------
*/
if (php_sapi_name() !== "cli") {
    header("Content-Type: application/json; charset=utf-8");

    if ($config["require_token"]) {
        $token = $_GET["token"] ?? "";
        if (!hash_equals($config["token"], $token)) {
            http_response_code(403);
            echo json_encode(["ok" => false, "error" => "Forbidden"]);
            exit;
        }
    }
}

/*
|--------------------------------------------------------------------------
| CRYPTO HELPERS
|--------------------------------------------------------------------------
*/

/** Ensure 32 bytes key: 64-hex → bin; else ASCII padded/truncated to 32. */
function makeAes256Key(string $keyRaw): string {
    if (ctype_xdigit($keyRaw) && strlen($keyRaw) === 64) {
        $key = hex2bin($keyRaw);
        if ($key === false) throw new RuntimeException("Invalid hex AES key");
    } else {
        $key = substr($keyRaw, 0, 32);
        $key = str_pad($key, 32, "\0");
    }
    if (strlen($key) !== 32) throw new RuntimeException("AES-256 key must be 32 bytes");
    return $key;
}

/** AES-256-ECB (PKCS7) + Base64 per vendor docs */
function encryptPayload(array $data, string $aesKeyRaw): string {
    $key = makeAes256Key($aesKeyRaw);
    $plaintext = json_encode($data, JSON_UNESCAPED_SLASHES);
    if ($plaintext === false) throw new RuntimeException("JSON encode failed for payload");
    $enc = openssl_encrypt($plaintext, "AES-256-ECB", $key, OPENSSL_RAW_DATA);
    if ($enc === false) throw new RuntimeException("AES-256-ECB encryption failed");
    return base64_encode($enc);
}

/*
|--------------------------------------------------------------------------
| HTTP HELPERS
|--------------------------------------------------------------------------
*/
function httpPostJson(string $url, array $payload, int $timeoutSec = 40): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ["Content-Type: application/json"],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_SLASHES),
        CURLOPT_TIMEOUT        => $timeoutSec,
    ]);

    $body = curl_exec($ch);
    $err  = curl_error($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $json = null;
    if (is_string($body) && $body !== "") {
        $json = json_decode($body, true);
    }

    return [
        "http_code" => $code,
        "error"     => $err ?: null,
        "body"      => $body,
        "json"      => $json,
    ];
}

/*
|--------------------------------------------------------------------------
| MARKER (DEDUPE) HELPERS
|--------------------------------------------------------------------------
*/
function loadMarker(string $path): array {
    if (!file_exists($path)) {
        return ["lastTimestamp" => "", "lastSerial" => ""];
    }
    $raw = @file_get_contents($path);
    if (!$raw) return ["lastTimestamp" => "", "lastSerial" => ""];
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return ["lastTimestamp" => "", "lastSerial" => ""];
    return [
        "lastTimestamp" => (string)($decoded["lastTimestamp"] ?? ""),
        "lastSerial"    => (string)($decoded["lastSerial"] ?? ""),
    ];
}

function saveMarker(string $path, array $marker): void {
    @file_put_contents($path, json_encode($marker, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

/**
 * Returns true if (ts, serial) is newer than (lastTs, lastSerial).
 * - Compares timestamps numerically if possible.
 * - If timestamps equal, compares serial strings.
 */
function isRecordNewer(string $ts, string $serial, string $lastTs, string $lastSerial): bool {
    if ($lastTs === "" && $lastSerial === "") return true;

    $tsIsNum = ctype_digit($ts);
    $lastIsNum = ctype_digit($lastTs);

    if ($tsIsNum && $lastIsNum) {
        $a = (int)$ts;
        $b = (int)$lastTs;
        if ($a > $b) return true;
        if ($a < $b) return false;
        // equal timestamp -> compare serial
        return strcmp($serial, $lastSerial) > 0;
    }

    // Fallback lexical compare
    if ($ts > $lastTs) return true;
    if ($ts < $lastTs) return false;
    return strcmp($serial, $lastSerial) > 0;
}

/** Sort newest first */
function compareNewestFirst(array $a, array $b): int {
    $ta = (string)($a["timestamp"] ?? "");
    $tb = (string)($b["timestamp"] ?? "");
    $sa = (string)($a["serial_number"] ?? "");
    $sb = (string)($b["serial_number"] ?? "");

    $taNum = ctype_digit($ta);
    $tbNum = ctype_digit($tb);

    if ($taNum && $tbNum) {
        $ia = (int)$ta;
        $ib = (int)$tb;
        if ($ia === $ib) return strcmp($sb, $sa); // desc serial
        return $ib <=> $ia; // desc ts
    }

    if ($ta === $tb) return strcmp($sb, $sa);
    return strcmp($tb, $ta);
}

/*
|--------------------------------------------------------------------------
| MAIN
|--------------------------------------------------------------------------
*/
$startedAt = gmdate("Y-m-d H:i:s");

$nowMs  = (int) round(microtime(true) * 1000);
$toDate   = $nowMs;
$fromDate = $toDate - (int)$config["lookback_ms"];

$markerOld = loadMarker($config["marker_file"]);
$marker    = $markerOld;

$page = 1;
$pageSize = (int)$config["page_size"];
$allRecords = [];
$vendorPages = 0;

try {
    do {
        $inner = [
            "timestamp"  => (string)$nowMs,
            "agency_uid" => $config["agency_uid"],
            "from_date"  => (string)$fromDate,
            "to_date"    => (string)$toDate,
            "page_no"    => $page,
            "page_size"  => $pageSize,
        ];

        $payload = encryptPayload($inner, $config["aes_key"]);
        $outer = [
            "agency_uid" => $config["agency_uid"],
            "timestamp"  => (string)$nowMs,
            "payload"    => $payload,
        ];

        $resp = httpPostJson($config["vendor_url"], $outer, 60);

        if ($resp["error"]) {
            throw new RuntimeException("Vendor cURL error: " . $resp["error"]);
        }

        if ($resp["http_code"] < 200 || $resp["http_code"] >= 300) {
            throw new RuntimeException("Vendor HTTP error: " . $resp["http_code"] . " body=" . (string)$resp["body"]);
        }

        $json = $resp["json"];
        if (!is_array($json)) {
            throw new RuntimeException("Vendor returned invalid JSON: " . (string)$resp["body"]);
        }

        $records = $json["payload"]["records"] ?? $json["data"]["payload"]["records"] ?? null;
        if (!is_array($records)) $records = [];

        $vendorPages++;

        foreach ($records as $t) {
            if (!is_array($t)) continue;

            $member = (string)($t["member_account"] ?? "");

            // Keep raw member_account (both h94044_id_b and h94044id); Node extractSbmId parses both.
            $allRecords[] = [
                "agency_uid"     => $config["agency_uid"],
                "serial_number"  => (string)($t["serial_number"] ?? ""),
                "currency_code"  => "BDT",
                "game_uid"       => (string)($t["game_uid"] ?? ""),
                "member_account" => $member,
                "bet_amount"     => $t["bet_amount"] ?? null,
                "win_amount"     => $t["win_amount"] ?? null,
                "timestamp"      => (string)($t["timestamp"] ?? ""),
                "game_round"     => $t["game_round"] ?? null,
            ];
        }

        $hasMore = count($records) === $pageSize;
        $page++;

    } while ($hasMore);

    // Filter new records by marker
    $newRecords = array_values(array_filter($allRecords, function ($r) use ($marker) {
        $ts = (string)($r["timestamp"] ?? "");
        $sn = (string)($r["serial_number"] ?? "");
        if ($ts === "" || $sn === "") return false;
        return isRecordNewer($ts, $sn, $marker["lastTimestamp"], $marker["lastSerial"]);
    }));

    if (count($newRecords) === 0) {
        $out = [
            "ok" => true,
            "message" => "No new records since last marker; nothing ingested.",
            "started_at_utc" => $startedAt,
            "finished_at_utc" => gmdate("Y-m-d H:i:s"),
            "window" => ["from_ms" => $fromDate, "to_ms" => $toDate],
            "vendor_pages" => $vendorPages,
            "vendor_records" => count($allRecords),
            "new_records" => 0,
            "marker" => $marker,
        ];
        echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Sort newest first
    usort($newRecords, "compareNewestFirst");

    // Update marker to newest BEFORE ingest (same idea as your JS)
    $newest = $newRecords[0];
    $marker["lastTimestamp"] = (string)$newest["timestamp"];
    $marker["lastSerial"]    = (string)$newest["serial_number"];
    saveMarker($config["marker_file"], $marker);

    $batchSize = (int)$config["batch_size"];
    $delayMs   = (int)$config["delay_ms"];

    $batches = array_chunk($newRecords, $batchSize);
    $batchResults = [];
    $ingestedCount = 0;

    foreach ($batches as $i => $batch) {
        $payload = ["records" => $batch];
        $ingestResp = httpPostJson($config["ingest_url"], $payload, 90);

        $ok = ($ingestResp["http_code"] >= 200 && $ingestResp["http_code"] < 300);

        $batchResults[] = [
            "batch" => $i + 1,
            "sent"  => count($batch),
            "http_code" => $ingestResp["http_code"],
            "ok" => $ok,
            "error" => $ingestResp["error"],
            "response_json" => $ingestResp["json"],
        ];

        if ($ok) {
            $ingestedCount += count($batch);
        } else {
            // Fatal ingest failure handling
            if ($config["revert_marker_on_fatal_ingest_failure"]) {
                saveMarker($config["marker_file"], $markerOld);
            }
            throw new RuntimeException("Ingest failed on batch " . ($i + 1) . " HTTP " . $ingestResp["http_code"]);
        }

        // Delay unless last batch
        if ($i + 1 < count($batches) && $delayMs > 0) {
            usleep($delayMs * 1000);
        }
    }

    $out = [
        "ok" => true,
        "message" => "Ingest completed.",
        "started_at_utc" => $startedAt,
        "finished_at_utc" => gmdate("Y-m-d H:i:s"),
        "window" => ["from_ms" => $fromDate, "to_ms" => $toDate],
        "vendor_pages" => $vendorPages,
        "vendor_records" => count($allRecords),
        "new_records" => count($newRecords),
        "ingested_records" => $ingestedCount,
        "marker" => $marker,
        "batch_results" => $batchResults,
    ];

    echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;

} catch (Throwable $e) {
    $out = [
        "ok" => false,
        "error" => $e->getMessage(),
        "started_at_utc" => $startedAt,
        "finished_at_utc" => gmdate("Y-m-d H:i:s"),
        "marker" => $markerOld,
    ];
    http_response_code(500);
    echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}
