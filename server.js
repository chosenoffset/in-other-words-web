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
        request: new Request(new URL(url, `http://${req.headers.host}`).toString()),
      })

      res.statusMessage = webRes.statusText
      res.status(webRes.status)
      webRes.headers.forEach((value, key) => res.setHeader(key, value))

      // Inject stylesheet link to ensure styles in dev
      const html = await webRes.text()
      const linkTag = '<link rel="stylesheet" href="/src/styles.css">'
      let styledHtml
      if (html.includes('</head>')) {
        styledHtml = html.replace('</head>', `${linkTag}</head>`)
      } else if (html.includes('</HEAD>')) {
        styledHtml = html.replace('</HEAD>', `${linkTag}</HEAD>`)
      } else if (html.includes('</body>')) {
        styledHtml = html.replace('</body>', `${linkTag}</body>`)
      } else if (html.includes('</BODY>')) {
        styledHtml = html.replace('</BODY>', `${linkTag}</BODY>`)
      } else {
        styledHtml = linkTag + html
      }
      res.send(styledHtml)
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


