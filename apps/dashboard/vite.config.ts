import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import type { Plugin } from 'vite'

const VAULT_LAUNCHES_DIR = path.resolve(__dirname, '../../vault/controller/launches')

function vaultWritePlugin(): Plugin {
  return {
    name: 'vault-write',
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
          const filepath = path.join(VAULT_LAUNCHES_DIR, filename)

          fs.mkdirSync(VAULT_LAUNCHES_DIR, { recursive: true })
          fs.writeFileSync(filepath, content, 'utf-8')

          res.statusCode = 200
          res.end(`Saved to ${filepath}`)
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vaultWritePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
