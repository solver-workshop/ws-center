'use strict'
const http = require('http')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Router = require('koa-router')
const config = require('config')
const mongoose = require('mongoose')
const ilog = require('ilog')
const Redis = require('ioredis')
const socketioRedis = require('shimo-socket.io-redis')
const SocketIO = require('socket.io')
const middlewares = require('./middleware')

process.on('uncaughtException', function (err) {
  ilog.error({ name: 'UncaughtExceptionError', message: err })
})

const app = new Koa()

mongoose.connect(
  `${config.mongo.host}`,
  {
    useNewUrlParser: true,
    user: config.mongo.user,
    pass: config.mongo.password,
    dbName: config.mongo.db
  }
)

app.use(middlewares.error)
app.use(middlewares.accessLogger)
app.use(bodyparser())

const router = new Router()
require('./router')(router)

app.use(router.routes())
app.use(router.allowedMethods())

const server = http.createServer(app.callback())

const socketIO = new SocketIO(server, config.socketIO)

socketIO.adapter(socketioRedis({
  pubClient: new Redis(config.redis),
  subClient: new Redis(config.redis),
  subEvent: 'messageBuffer',
  // NOTE: https://github.com/socketio/socket.io-redis/issues/210
  requestsTimeout: 15000
}))

module.exports = server.listen(config.app.port, function () {
  ilog.info(`${config.app.name} is listening at http://127.0.0.1:${config.app.port}, god bless it.`)
})
