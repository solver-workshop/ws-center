'use strict'
const _ = require('lodash')
const ilog = require('ilog')
const { MESSAGE_TYPE } = require('../util/constant')
const { promisify } = require('../util/promise')

let socketIO = null
let adapter = null

function init (socketIOInstance) {
  module.exports.socketIO = socketIO = socketIOInstance
  module.exports.adapter = adapter = socketIO.of('/').adapter

  socketIO.on('connection', async function (socket) {
    try {
      const userId = getUserId(socket)

      ilog.debug({
        class: 'recive-connection',
        message: { userId, socketId: socket.id }
      })

      if (!userId) {
        ilog.debug({
          class: 'socket-unauthed-user',
          message: socket.id
        })

        socket.disconnect(true)

        return
      }

      await promisify(
        adapter,
        'remoteJoin',
        socket.id,
        getUserRoom(userId)
      )
    } catch (error) {
      ilog.error({ class: 'socket-connection-error', message: error.message, stack: error.stack })
    }
  })

  adapter.customHook = function (data, callback) {
    switch (data.type) {
      case MESSAGE_TYPE.BROADCAST_MESSAGE:
        let { room, messageBody } = data

        ilog.info({
          class: 'revice-broadcast-message',
          room,
          messageBody
        })

        room = adapter.rooms[room]

        // eslint-disable-next-line
        if (!room || !messageBody) return callback(0)

        const allSocketIds = room.sockets
        const connectedSockets = {}

        for (const socketId of allSocketIds) {
          if (!connectedSockets.hasOwnProperty(socketId)) continue
          if (connectedSockets[socketId]) continue

          const socket = socketIO.of('/').connected[socketId]

          if (socket) connectedSockets[socketId] = socket
        }

        const count = Object.keys(connectedSockets).map(function (socketId) {
          try {
            if (_.isString(messageBody)) messageBody = JSON.parse(messageBody)

            connectedSockets[socketId].json.send(messageBody)

            return true
          } catch (error) {
            ilog.error({
              class: 'emit-message-error',
              message: error.message,
              socketId,
              messageBody
            })

            return false
          }
        }).filter(Boolean).length

        callback(count)
        break
      default:
        callback()
    }
  }
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
  adapter,
  getUserRoom
}
