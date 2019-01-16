'use strict'
const socketService = require('../service/websocket')

async function isOnline (userId) {
  return new Promise(function (resolve, reject) {
    socketService.socketIO.of('/').adapter.clients([socketService.getUserRoom(userId)], function (err, clients) {
      if (err) return reject(err)

      return resolve(clients.length > 0)
    })
  })
}

module.exports = {
  isOnline
}
