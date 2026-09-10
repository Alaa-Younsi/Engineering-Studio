# Octenium backend — video hosting

Images stay on **Supabase Storage** (its on-the-fly resize endpoint is what keeps
egress under control). **Video** is uploaded to this hosting account instead —
the plan has ~300 GB — and served straight off `https://engineering-studio.net/media/`.

This folder is **not** part of the Vite build. Its three files are deployed by
hand, once. After that the admin dashboard uploads video to `upload.php` on its
own (chunked, admin-only).

```
octenium/
  upload.php          → <docroot>/media/upload.php
  media.htaccess      → <docroot>/media/.htaccess      (rename)
  config.sample.php   → copy to <docroot>/media/config.php and fill in
```

`<docroot>` is the document root of `engineering-studio.net` — usually
`~/public_html` (or `~/public_html/media` for the target below).

---

## One-time setup

1. **Create the directory.** In cPanel → File Manager, make `public_html/media/`.

2. **Upload the three files** into `public_html/media/`:
   - `upload.php` as-is
   - `media.htaccess` → rename to `.htaccess`
   - `config.sample.php` → copy to `config.php`, then edit:
     - `supabase_url` / `supabase_anon_key` — the **public** pair from
       Supabase → Project settings → API. These are the same values the
       frontend ships; they are not secrets. Never put the `service_role` key here.
     - `public_base` — leave as `https://engineering-studio.net/media`
       unless you deploy somewhere else.

3. **Permissions.** `media/` must be writable by PHP (`755` is usually fine on
   a suPHP/LiteSpeed setup; use `775`/`777` only if uploads fail with a
   "Cannot open working file" error). `upload.php` creates `media/.parts/`
   itself for in-progress chunks.

4. **PHP version.** cPanel → MultiPHP Manager → set `engineering-studio.net`
   to **PHP 8.1 or newer**. `cURL` and `fileinfo` extensions must be on
   (they are, by default).

5. **Check `Authorization` passes through.** `media.htaccess` already sets
   `CGIPassAuth On` and a `SetEnvIf` fallback. If step 7's test returns
   `401 Missing bearer token` even with a valid token, ask Octenium support to
   confirm the header reaches PHP, or switch the domain's PHP handler to
   LSAPI / FPM.

6. **SSL.** AutoSSL must cover `engineering-studio.net` before go-live — the
   dashboard only ever calls `https://…/media/upload.php`.

7. **Smoke test.**
   ```sh
   # No token → must be 401, not 500/403-config.
   curl -i -X POST https://engineering-studio.net/media/upload.php \
     -F uploadId=00000000-0000-4000-8000-000000000000 \
     -F chunkIndex=0 -F totalChunks=1 -F ext=mp4 \
     -F chunk=@/dev/null
   ```
   Expected: `HTTP/1.1 401` and `{"error":"Missing bearer token"}`.
   `{"error":"config.php is missing…"}` means step 2 isn't done.

8. **End to end.** Sign in to `/admin`, open a project, add a **Vidéo** tile,
   upload a short `.mp4`. The button shows `Téléversement… NN%`. When it
   finishes the tile plays the file from `https://engineering-studio.net/media/…`.
   Save the project and confirm it plays on the public site.

---

## How it works

- The dashboard slices the file into 8 MiB chunks and POSTs them in order.
  Small requests stay inside shared-hosting PHP limits and give a progress bar.
- Chunk 0 carries the Supabase access token. `upload.php` calls Supabase REST
  with it for the caller's own `public.admins` row — a row back proves the
  token is valid **and** the user is an admin (RLS does both checks). The rest
  of the chunks are bound to chunk 0 by an unguessable upload id.
- The final chunk is MIME-sniffed (`finfo`); only `video/*` is promoted. The
  saved name is random (`20260907-1a2b3c4d5e6f7a8b.mp4`), so files are
  immutable and cached for a year.
- `.parts/` working files from abandoned uploads are cleared after 24 h on the
  next request.

## Limits & caveats

- **Per-file ceiling: 3 GB** (`max_total_bytes` in `config.php`, matched in
  `src/lib/octeniumUpload.ts`). Larger files: upload by FTP into
  `public_html/media/` and paste `https://engineering-studio.net/media/<file>`
  into the tile's URL field.
- **Confidential devis attachments stay on Supabase** (private bucket, signed
  URLs). Do **not** route those here — this directory is world-readable.
- **Shared-hosting fair-use.** 300 GB of storage is not 300 GB/month of
  streaming. Heavy concurrent video traffic can trip Octenium's CPU/I-O limits
  or their acceptable-use policy. Watch cPanel → Metrics → Resource Usage after
  launch. If it becomes a problem the code is built to move video to a CDN
  (Bunny Stream, Cloudflare R2) by changing `MEDIA_ORIGIN` in
  `src/config/site.ts`, moving the files, and widening `media-src` in
  `public/.htaccess`.

## Moving video to a CDN later

1. Create the bucket/library on the CDN; copy `public_html/media/*.mp4` into it.
2. Set `MEDIA_ORIGIN` in `src/config/site.ts` to the CDN origin (and set
   `VITE_MEDIA_UPLOAD_URL` if the upload endpoint moves too).
3. Add the CDN host to `img-src` / `media-src` / `connect-src` in
   `public/.htaccess`.
4. Rewrite existing `https://engineering-studio.net/media/…` URLs on the
   `projects` rows to the new origin (one SQL `update`).
