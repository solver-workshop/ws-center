'use strict'
const ilog = require('ilog')

let socketIO = null

function init (socketIOInstance) {
  module.exports.socketIO = socketIO = socketIOInstance

  socketIO.on('connection', async function (socket) {
    try {
      const userId = getUserId(socket)

      ilog.debug({ class: 'recive-connection', message: { userId, socketId: socket.id } })

      if (!userId) {
        ilog.debug({ class: 'socket-unauthed-user', message: socket.id })
        socket.disconnect(true)

        return
      }

      await new Promise(function (resolve, reject) {
        socketIO.of('/').adapter.remoteJoin(socket.id, getUserRoom(userId), function (err) {
          if (err) return reject(err)

          return resolve(null)
        })
      })
    } catch (error) {
      ilog.error({ class: 'socket-connection-error', message: error.message, stack: error.stack })
    }
  })
}

function getUserId (socket) {
  return socket.handshake.query.userId
}

function getUserRoom (userId) {
  return `socket:user:${userId}`
}

module.exports = {
  init,
  socketIO,
  getUserRoom
}
