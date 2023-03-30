import React from 'react'
import { renderToPipeableStream, renderToReadableStream } from "react-dom/server";
import { join } from 'path'

function renderTest () {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <h1>This is the render test</h1>
      </body>
    </html>
  )
}

export async function test12() {
  // const app = await import(join(__dirname, '../../modules', "hello-module", 'app.js'))
  const Render = renderTest //app.default.default

  // const { pipe } = renderToPipeableStream(<Render />, {
  //   // bootstrapScripts: ['/main.js'],
  //   onShellReady() {
  //     response.setHeader('content-type', 'text/html');
  //     console.log(response)
  //     pipe(response);
  //   }
  // })

  const stream = await renderToReadableStream(<Render />, {
    // bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}