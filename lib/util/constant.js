'use strict'

const MESSAGE_TYPE = {
  BROADCAST_MESSAGE: 'broadcast-message',
  ROOM_ACTION: 'room-action'
}

const ROOM_ACTIONS = {
  JOIN: 'join',
  LEAVE: 'leave',
  PUSH: 'push'
}

module.exports = {
  MESSAGE_TYPE,
  ROOM_ACTIONS
}
