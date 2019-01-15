'use strict'
const { promisify } = require('util')
const ilog = require('ilog')

let socketIO = null

function init (socketIOInstance) {
  socketIO = socketIOInstance

  socketIO.on('connection', async function (socket) {
    try {
      const userId = getUserId(socket)

      if (!userId) {
        ilog.debug({ class: 'socket-unauthed-user', message: socket.id })
        socket.disconnect(true)

        return
      }

      await promisify(socketIO.adapter.remoteJoin)(socket.id, getUserRoom(socket.id))
    } catch (error) {
      ilog.error({ class: 'socket-connection-error', message: error })
    }
  })
}

function getUserId (socket) {
  return socket.request.headers['X-SOCKET-USER-ID']
}

function getUserRoom (userId) {
  return `socket:user:${userId}`
}

module.exports = {
  init,
  socketIO,
  getUserRoom
}
