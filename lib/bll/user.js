'use strict'
const _ = require('lodash')
const socketService = require('../service/websocket')
const { MESSAGE_TYPE } = require('../util/constant')

async function isOnline (userId) {
  return new Promise(function (resolve, reject) {
    socketService
      .socketIO
      .of('/')
      .adapter
      .clients([socketService.getUserRoom(userId)], function (err, clients) {
        if (err) return reject(err)

        return resolve(clients.length > 0)
      })
  })
}

async function pushMessageToUsers (userIds, messageBody) {
  await Promise.all(userIds.map(async function (userId) {
    await pushMessageToRoom(socketService.getUserRoom(userId), messageBody)
  }))
}

async function pushMessageToRoom (room, messageBody) {
  const responses = await new Promise(function (resolve, reject) {
    socketService.socketIO.of('/').adapter.customRequest({
      type: MESSAGE_TYPE.BROADCAST_MESSAGE,
      room,
      messageBody
    }, function (error, response) {
      if (error) return reject(error)

      return resolve(response)
    })
  })

  return _.sum(responses)
}

module.exports = {
  isOnline,
  pushMessageToUsers
}
