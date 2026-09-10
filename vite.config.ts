import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    // Emit hashed bundles to `dist/app/`, NOT the default `dist/assets/`.
    // `public/Assets/` (capital) is copied to `dist/Assets/`, and a
    // case-insensitive Windows filesystem merges `assets` + `Assets` into one
    // folder — which then uploads to a case-sensitive Linux host with the JS
    // bundles under the wrong path and the site loads blank. A distinct name
    // avoids the collision on every OS.
    assetsDir: 'app',
  },
})
