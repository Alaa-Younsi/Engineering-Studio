<?php
/**
 * Copy this file to `config.php` in the SAME directory and fill in the values.
 * `config.php` is git-ignored.
 *
 * Both Supabase values are the PUBLIC pair the frontend already ships in its
 * bundle — they are NOT secrets. The `service_role` key must never appear here.
 */

return [
    // Supabase → Project settings → API → Project URL
    'supabase_url' => 'https://mutcpgflaqyeibvuowfi.supabase.co',

    // Supabase → Project settings → API → Project API keys → `anon` `public`
    'supabase_anon_key' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dGNwZ2ZsYXF5ZWlidnVvd2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MzUwNjUsImV4cCI6MjEwMDUxMTA2NX0.ojV6nb861JcYyoRppzigcZjsFcjQZGn6JWMn08IQQBk',

    // Absolute public base for finished files, no trailing slash.
    // This is the directory this script lives in, as seen from the web.
    'public_base' => 'https://engineering-studio.net/media',

    // Hard ceiling per file (bytes). Anything larger should be uploaded over
    // FTP and wired in with the "paste a URL" field in the dashboard.
    'max_total_bytes' => 3221225472, // 3 GiB
];
