'use strict'
const pkg = require('../package')
const api = require('./api')

module.exports = function (router) {
  router.get('/', async function (ctx) {
    ctx.body = {
      name: pkg.name,
      version: pkg.version
    }
  })

  router.get('/users/:userId/online', api.user.isOnline)
  router.post('/users/:userId/push', api.user.pushToUser)
  router.post('/users/push', api.user.pushToUsers)
  router.post('/rooms/:roomName/join', api.room.join)
  router.del('/rooms/:roomName/leave', api.room.leave)
  router.post('/rooms/:roomName/push', api.room.push)
}
