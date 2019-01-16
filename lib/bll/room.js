'use strict'
const socketService = require('../service/websocket')
const { promisify } = require('../util/promise')
const { MESSAGE_TYPE, ROOM_ACTIONS } = require('../util/constant')

async function join (userIds, roomName) {
  await promisify(
    socketService.adapter,
    'customRequest',
    {
      type: MESSAGE_TYPE.ROOM_ACTION,
      action: ROOM_ACTIONS.JOIN,
      roomName,
      userIds
    }
  )
}

async function leave (userIds, roomName) {
  await promisify(
    socketService.adapter,
    'customRequest',
    {
      type: MESSAGE_TYPE.ROOM_ACTION,
      action: ROOM_ACTIONS.LEAVE,
      roomName,
      userIds
    }
  )
}

async function push (roomName, messageBody) {
  const [count] = await promisify(
    socketService.adapter,
    'customRequest',
    {
      type: MESSAGE_TYPE.ROOM_ACTION,
      action: ROOM_ACTIONS.PUSH,
      roomName,
      messageBody
    }
  )

  return count
}

module.exports = {
  join,
  leave,
  push
}
