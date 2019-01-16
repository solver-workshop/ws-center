'use strict'
const _ = require('lodash')
const ilog = require('ilog')
const config = require('config')
const { MESSAGE_TYPE, ROOM_ACTIONS } = require('../util/constant')
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
    ;(async function () {
      switch (data.type) {
        case MESSAGE_TYPE.BROADCAST_MESSAGE:
          let { room, messageBody } = data

          ilog.info({
            class: 'revice-broadcast-message',
            room,
            messageBody
          })

          if (!room || !messageBody) return 0

          return sendMessageBodyToSockets(
            getSocketsByRoomName(room),
            messageBody
          )
        case MESSAGE_TYPE.ROOM_ACTION:
          let { action, roomName, userIds } = data

          ilog.info({
            class: 'revice-room-message',
            action,
            roomName,
            userIds
          })

          if ([ROOM_ACTIONS.JOIN, ROOM_ACTIONS.LEAVE].includes(action)) {
            if (!roomName || !Array.isArray(userIds)) return null

            await Promise.all(userIds.map(async function (userId) {
              const sockets = getSocketsByUserId(userId)

              await Promise.all(Object.keys(sockets).map(async function (id) {
                await promisify(
                  adapter,
                  action === ROOM_ACTIONS.JOIN ? 'remoteJoin' : 'remoteLeave',
                  id,
                  getRoomName(roomName)
                )
              }))
            }))
          } else if (action === ROOM_ACTIONS.PUSH) {
            if (!roomName || !data.messageBody) return 0

            return sendMessageBodyToSockets(
              getSocketsByRoomName(getRoomName(roomName)),
              data.messageBody
            )
          }
          break
        default:
          return null
      }
    })().then(callback).catch(ilog.error)
  }
}

function getUserId (socket) {
  return socket.handshake.query.userId
}

function getUserRoom (userId) {
  return `${config.redis.prefix}:user:${userId}`
}

function getRoomName (roomName) {
  return `${config.redis.prefix}:room:${roomName}`
}

function getSocketsByUserId (userId) {
  return getSocketsByRoomName(getUserRoom(userId))
}

function getSocketsByRoomName (roomName) {
  const room = adapter.rooms[roomName]
  const connectedSocketsObject = {}

  if (!room) return connectedSocketsObject

  const allSockets = room.sockets

  for (const socketId in allSockets) {
    if (!allSockets.hasOwnProperty(socketId)) continue
    if (connectedSocketsObject[socketId]) continue

    const socket = socketIO.of('/').connected[socketId]

    if (socket) {
      connectedSocketsObject[socketId] = socket
    }
  }

  return connectedSocketsObject
}

function sendMessageBodyToSockets (connectedSockets, messageBody) {
  return Object.keys(connectedSockets).map(function (socketId) {
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
}

module.exports = {
  init,
  socketIO,
  adapter,
  getUserRoom,
  getRoomName
}
