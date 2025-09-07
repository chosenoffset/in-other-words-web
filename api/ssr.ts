import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '../dist/server/entry-server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
    const request = new Request(new URL(req.url || '/', origin))

    const webRes = await render({ request })

    // Read Vite manifest to inject CSS and client entry
    const manifestPath = path.resolve(
      __dirname,
      '../dist/client/.vite/manifest.json'
    )
    let cssLinks = ''
    let clientScript = ''
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      const entry = Object.values<any>(manifest).find((m: any) => m.isEntry)
      const cssFiles: string[] = entry?.css ?? []
      cssLinks = cssFiles
        .map(href => `<link rel="stylesheet" href="/${href}">`)
        .join('')
      if (entry?.file) {
        clientScript = `<script type="module" src="/${entry.file}"></script>`
      }
    }

    const html = await webRes.text()
    const withCss = html.replace('</head>', `${cssLinks}</head>`)
    const withJs = withCss.replace('</body>', `${clientScript}</body>`)

    res.status(webRes.status)
    webRes.headers.forEach((v, k) => res.setHeader(k, v))
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(withJs)
  } catch (e: any) {
    console.error(e)
    res.status(500).send('Internal Server Error')
  }
}
