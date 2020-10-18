const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes')
const logger = require('./logger')
const config = require('./config')

const { env } = process
const node_env = env.NODE_ENV || 'development'
const port = env.PORT || config.port

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(routes)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.write(err.message || 'Internal Server Error')
  res.end()
})

const server = http.createServer(app)
server.listen(port)
server.on('listening', () => {
  logger.info({
    port,
    node_env,
    log: config.logger.level,
  }, 'server started')
})
