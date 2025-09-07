import { createServer as createViteServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  const express = (await import('express')).default
  const app = express()

  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

      const webRes = await render({
        request: new Request(
          new URL(url, `http://${req.headers.host}`).toString()
        ),
      })

      res.statusMessage = webRes.statusText
      res.status(webRes.status)
      webRes.headers.forEach((value, key) => res.setHeader(key, value))

      // Inject stylesheet link and client script to ensure styles and hydration in dev
      const html = await webRes.text()
      const port = process.env.PORT || 3000
      const viteTag = `<script type="module">
        import RefreshRuntime from 'http://localhost:${port}/@react-refresh'
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>`
      const linkTag = '<link rel="stylesheet" href="/src/styles.css">'
      const scriptTag =
        '<script type="module" src="/src/entry-client.tsx"></script>'
      const injectedContent = `${viteTag}${linkTag}${scriptTag}`

      let finalHtml
      if (html.includes('</head>')) {
        finalHtml = html.replace('</head>', `${injectedContent}</head>`)
      } else if (html.includes('</HEAD>')) {
        finalHtml = html.replace('</HEAD>', `${injectedContent}</HEAD>`)
      } else if (html.includes('</body>')) {
        finalHtml = html.replace('</body>', `${injectedContent}</body>`)
      } else if (html.includes('</BODY>')) {
        finalHtml = html.replace('</BODY>', `${injectedContent}</BODY>`)
      } else {
        finalHtml = injectedContent + html
      }
      res.send(finalHtml)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`SSR dev server running at http://localhost:${port}`)
  })
}

createServer()
