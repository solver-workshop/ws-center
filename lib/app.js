'use strict'
const http = require('http')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Router = require('koa-router')
const config = require('config')
const ilog = require('ilog')
const SocketIO = require('socket.io')
const socketioRedis = require('socket.io-redis')
const middlewares = require('./middleware')
const redis = require('./service/redis')

process.on('uncaughtException', function (err) {
  ilog.error({ name: 'UncaughtExceptionError', message: err.message, stack: err.stack })
})

const app = new Koa()

app.use(middlewares.error)
app.use(middlewares.accessLogger)
app.use(bodyparser())

const router = new Router()
require('./router')(router)

app.use(router.routes())
app.use(router.allowedMethods())

const server = http.createServer(app.callback())

server.socketIO = new SocketIO(server, config.socketIO)

server.socketIO.adapter(socketioRedis({
  pubClient: redis,
  subClient: redis,
  subEvent: 'messageBuffer',
  // NOTE: https://github.com/socketio/socket.io-redis/issues/210
  requestsTimeout: 15000
}))

require('./service/websocket').init(server.socketIO)

module.exports = server.listen(config.app.port, function () {
  ilog.info(`${config.app.name} is listening at http://127.0.0.1:${config.app.port}, god bless it.`)
})
