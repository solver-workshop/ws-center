'use strict'
const { promisify } = require('util')
const ilog = require('ilog')

let socketIO = null

function init (socketIOInstance) {
  socketIO = socketIOInstance

  socketIO.on('connection', async function (socket) {
    try {
      await promisify(socketIO.adapter.remoteJoin)(socket.id, getUserRoom(socket.id))
    } catch (error) {
      ilog.error({ class: 'socket-connection-error', message: error })
    }
  })
}

function getUserRoom (userId) {
  return `socket:user:${userId}`
}

module.exports = {
  init
}
