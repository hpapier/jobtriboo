const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default

const { NextI18NextInstance } = require('./components/i18n')

const port = process.env.PORT || 3000
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();

(async () => {
  try {
    await app.prepare()
    const server = express()
    server.use(nextI18NextMiddleware(NextI18NextInstance))

    server.get('*', (req, res) => handle(req, res))

    await server.listen(port)
    console.log(`-> Ready mode:${process.env.NODE_ENV} - port:${port}`) // eslint-disable-line no-console
  } catch (e) {
    console.log("-> Next Server Error:");
    console.log(e);
  }

})()