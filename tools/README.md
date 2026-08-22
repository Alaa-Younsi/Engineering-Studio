# Visual QA harness

Drives headless Chrome over the CDP (no npm deps) to check the build against
the Figma reference renders in `screenshots/`.

| tool | what it does |
| --- | --- |
| `cdp.mjs` | minimal CDP driver — launch, connect, navigate, evaluate |
| `shot.mjs` | full-page screenshot at an exact CSS width (`--click`, `--wait`, `--h`) |
| `hovershot.mjs` | screenshots an element with the mouse hovering it |
| `diff.py` | render vs reference: mean error, %>32, worst bands, overlay + side-by-side |
| `probe.py` | per-element ink-box comparison, reported in pixels of drift |
| `typetest*.mjs` | renders Bossa at the design sizes so tracking can be fitted |
| `extract_logo.py` | flattens a Figma-exported lockup into one standalone SVG |
| `adminflow.mjs` / `adminwrite.mjs` / `adminsubs.mjs` | end-to-end admin dashboard checks |
| `adminsmoke.mjs` | boots the admin and reports what a signed-out user sees |
| `backendcheck.mjs` | Supabase preflight: is the project reachable, is schema.sql applied |

Typical loop (dev server on :5173):

```sh
node tools/shot.mjs "http://localhost:5173/?capture=1" out.png 1920 1
python tools/diff.py out.png "screenshots/Accueil (1920x1080).jpg" out
python tools/probe.py out.png "screenshots/Accueil (1920x1080).jpg" probes.json
```

`?capture=1` disables the intro sequence and scroll reveals so every section
renders in its final state.

Before deploying, or when the dashboard misbehaves:

```sh
node tools/backendcheck.mjs
```

Note: `screenshots/*.jpg` were exported 23 Jun and `public/Converted/*` on
15 Jul. Where they disagree the Converted export wins — it is newer and
includes photography the JPGs are missing.
