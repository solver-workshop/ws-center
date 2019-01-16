'use strict'
const { promisify } = require('../util/promise')
const _ = require('lodash')
const socketService = require('../service/websocket')
const { MESSAGE_TYPE } = require('../util/constant')

async function isOnline (userId) {
  const clients = await promisify(
    socketService.adapter,
    'clients',
    [socketService.getUserRoom(userId)]
  )

  return clients.length > 0
}

async function pushMessageToUsers (userIds, messageBody) {
  const counts = await Promise.all(userIds.map(async function (userId) {
    const count = await pushMessageToRoom(
      socketService.getUserRoom(userId), messageBody
    )

    return count
  }))

  return _.sum(counts)
}

async function pushMessageToRoom (room, messageBody) {
  const responses = await promisify(
    socketService.adapter,
    'customRequest',
    {
      type: MESSAGE_TYPE.BROADCAST_MESSAGE,
      room,
      messageBody
    }
  )

  return _.sum(responses)
}

module.exports = {
  isOnline,
  pushMessageToUsers
}
