import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { Plugin } from 'vite'

const SERVER_ORIGIN = 'http://localhost:4500'

// Proxy the legacy PUT /__vault/<filename> calls to the server's vault route.
function vaultWritePlugin(): Plugin {
  return {
    name: 'vault-write-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/__vault/') || req.method !== 'PUT') {
          return next()
        }
        const filename = decodeURIComponent(req.url.replace('/__vault/', ''))
        if (filename.includes('..') || filename.includes('/')) {
          res.statusCode = 400
          res.end('Invalid filename')
          return
        }
        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', () => {
          const content = Buffer.concat(chunks).toString('utf-8')
          fetch(`${SERVER_ORIGIN}/api/vault/launches/${encodeURIComponent(filename)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: content,
          })
            .then(async (r) => {
              res.statusCode = r.status
              res.end(await r.text())
            })
            .catch((err) => {
              res.statusCode = 502
              res.end(String(err))
            })
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vaultWritePlugin()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: SERVER_ORIGIN,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
