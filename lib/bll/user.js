'use strict'
const { promisify } = require('util')
const socketService = require('../service/websocket')

async function isOnline (userId) {
  const clients = await promisify(socketService.socketIO.adapter.clients)(
    [socketService.getUserRoom(userId)]
  )

  return clients.length > 0
}

module.exports = {
  isOnline
}
