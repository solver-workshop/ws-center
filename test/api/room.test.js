/* global describe it before */
'use strict'
const request = require('supertest')(require('../../lib/app'))
const SocketClient = require('socket.io-client')
const ilog = require('ilog')

describe('api - room', function () {
  let userId, userId2, userId3, roomName
  before(function (callback) {
    roomName = `TEST_ROOM_${Math.random().toString(36).substring(7)}`

    userId = Math.random().toString(36).substring(7)
    userId2 = Math.random().toString(36).substring(7)
    userId3 = Math.random().toString(36).substring(7)

    const userIds = [userId, userId2, userId3]

    let connected = 0

    for (const id of userIds) {
      const client = SocketClient('http://localhost:9001', {
        query: { userId: id },
        path: '/ws'
      })

      client.on('connect', function () {
        ilog.debug({
          class: 'client-connect',
          message: client.connected,
          userId: id
        })

        if (++connected === userIds.length) callback()
      })
    }
  })

  describe('join', function () {
    it('Join 3 users', async function () {
      await request
        .post(`/rooms/${roomName}/join`)
        .query({
          userIds: `${userId},${userId2},${userId3}`
        })
        .expect(204)
    })
  })

  describe('leave', function () {
    it('Leave 1 user', async function () {
      await request
        .del(`/rooms/${roomName}/leave`)
        .query({
          userIds: `${userId},${userId2}`
        })
        .expect(204)
    })
  })
})
