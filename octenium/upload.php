<?php

declare(strict_types=1);

/**
 * Chunked receiver for large public media (project video).
 *
 * The admin dashboard slices a file and POSTs it here one part at a time
 * (src/lib/octeniumUpload.ts). Assembled files land in this same directory and
 * are served straight off  https://engineering-studio.net/media/<name>.<ext> .
 *
 * ── Auth ────────────────────────────────────────────────────────────────────
 * The FIRST chunk carries the caller's Supabase access token in the
 * Authorization header. We ask Supabase, with that token, for the caller's own
 * row in `public.admins` (RLS policy "admins read self"). A row back means the
 * token is real, unexpired, and belongs to an admin. We then trust the
 * unguessable per-upload id for the remaining chunks.
 *
 * No secret lives here — see config.sample.php.
 *
 * ── Requirements ────────────────────────────────────────────────────────────
 * PHP 8.1+, cURL, fileinfo. This directory must be writable by PHP.
 * Deploy alongside `.htaccess` (from octenium/media.htaccess) and `config.php`.
 */

$cfg = @include __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/** Emit `{error}` and stop. */
function fail(int $code, string $message): void
{
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

if (!is_array($cfg)) {
    fail(500, 'config.php is missing — copy config.sample.php and fill it in.');
}

const MAX_CHUNK_BYTES = 33_554_432; // 32 MiB — reject oversized slices
const ALLOWED_EXT = ['mp4', 'webm', 'mov', 'm4v'];

$tmpDir = __DIR__ . '/.parts';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function bearer_token(): string
{
    $raw = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($raw === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strcasecmp($name, 'authorization') === 0) {
                $raw = $value;
                break;
            }
        }
    }
    return preg_match('/^Bearer\s+(.+)$/i', trim($raw), $m) === 1 ? trim($m[1]) : '';
}

/** 401/403 unless the bearer token belongs to a row in public.admins. */
function assert_admin(array $cfg): void
{
    $token = bearer_token();
    if ($token === '') {
        fail(401, 'Missing bearer token');
    }

    $ch = curl_init(rtrim($cfg['supabase_url'], '/') . '/rest/v1/admins?select=user_id&limit=1');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $cfg['supabase_anon_key'],
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ],
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($status === 0) {
        fail(502, 'Auth backend unreachable');
    }
    if ($status !== 200) {
        fail(401, 'Token rejected by Supabase');
    }
    $rows = json_decode((string) $body, true);
    if (!is_array($rows) || count($rows) === 0) {
        fail(403, 'Not an administrator');
    }
}

/** Delete part/idx working files left behind by abandoned uploads (> 24 h). */
function gc_parts(string $dir): void
{
    foreach (glob($dir . '/*') ?: [] as $path) {
        if (is_file($path) && basename($path) !== '.htaccess' && time() - (int) filemtime($path) > 86_400) {
            @unlink($path);
        }
    }
}

/* ── Request guard ───────────────────────────────────────────────────────── */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'POST only');
}

// Bearer-token auth isn't cookie-based, so this is only a soft guard.
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
if ($origin !== '' && strpos($origin, 'https://engineering-studio.net') !== 0) {
    fail(403, 'Unexpected origin');
}

if (!is_dir($tmpDir)) {
    @mkdir($tmpDir, 0700, true);
}
@file_put_contents($tmpDir . '/.htaccess', "Require all denied\n");
gc_parts($tmpDir);

/* ── Parameters ──────────────────────────────────────────────────────────── */

$uploadId = (string) ($_POST['uploadId'] ?? '');
$chunkIndex = (int) ($_POST['chunkIndex'] ?? -1);
$totalChunks = (int) ($_POST['totalChunks'] ?? 0);
$ext = preg_replace('/[^a-z0-9]/', '', strtolower((string) ($_POST['ext'] ?? ''))) ?? '';

if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $uploadId) !== 1) {
    fail(400, 'Malformed uploadId');
}
if ($totalChunks < 1 || $chunkIndex < 0 || $chunkIndex >= $totalChunks) {
    fail(400, 'Bad chunk index');
}
if (!in_array($ext, ALLOWED_EXT, true)) {
    fail(415, 'Unsupported file type');
}
if (!isset($_FILES['chunk']) || $_FILES['chunk']['error'] !== UPLOAD_ERR_OK) {
    fail(400, 'No chunk in request');
}
if (($_FILES['chunk']['size'] ?? 0) > MAX_CHUNK_BYTES) {
    fail(413, 'Chunk too large');
}

$partFile = $tmpDir . '/' . $uploadId . '.part';
$idxFile = $tmpDir . '/' . $uploadId . '.idx';

/* ── Assemble ────────────────────────────────────────────────────────────── */

if ($chunkIndex === 0) {
    assert_admin($cfg);
    @unlink($partFile);
    file_put_contents($idxFile, '0');
}

$expected = is_file($idxFile) ? (int) file_get_contents($idxFile) : -1;
if ($expected !== $chunkIndex) {
    fail(409, "Out of order: expected chunk $expected");
}

$in = fopen($_FILES['chunk']['tmp_name'], 'rb');
$out = fopen($partFile, 'ab');
if ($in === false || $out === false) {
    fail(500, 'Cannot open working file');
}
flock($out, LOCK_EX);
stream_copy_to_stream($in, $out);
fflush($out);
flock($out, LOCK_UN);
fclose($in);
fclose($out);

if (filesize($partFile) > (int) $cfg['max_total_bytes']) {
    @unlink($partFile);
    @unlink($idxFile);
    fail(413, 'File exceeds the size limit');
}

file_put_contents($idxFile, (string) ($chunkIndex + 1));

if ($chunkIndex < $totalChunks - 1) {
    echo json_encode(['ok' => true, 'received' => $chunkIndex + 1]);
    exit;
}

/* ── Final chunk: validate and publish ───────────────────────────────────── */

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = (string) finfo_file($finfo, $partFile);
finfo_close($finfo);

$mimeOk = str_starts_with($mime, 'video/')
    || ($mime === 'application/octet-stream' && in_array($ext, ['mov', 'm4v'], true));
if (!$mimeOk) {
    @unlink($partFile);
    @unlink($idxFile);
    fail(415, "Assembled file is not a video ($mime)");
}

$name = date('Ymd') . '-' . bin2hex(random_bytes(8)) . '.' . $ext;
if (!rename($partFile, __DIR__ . '/' . $name)) {
    @unlink($partFile);
    @unlink($idxFile);
    fail(500, 'Could not finalise the file');
}
@chmod(__DIR__ . '/' . $name, 0644);
@unlink($idxFile);

echo json_encode([
    'ok' => true,
    'path' => $name,
    'url' => rtrim($cfg['public_base'], '/') . '/' . $name,
]);
