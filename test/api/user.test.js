/* global describe it before */
'use strict'
const request = require('supertest')(require('../../lib/app'))
const assert = require('power-assert')
const SocketClient = require('socket.io-client')
const ilog = require('ilog')

describe('api - user', function () {
  let userId, userId2, userId3
  before(function (callback) {
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

  describe('isOnline', function () {
    it('Online User', async function () {
      let { body } = await request
        .get(`/users/${userId}/online`)
        .expect(200)

      assert.strictEqual(body.isOnline, true)
    })

    it('Offline User', async function () {
      let { body } = await request
        .get(`/users/${Math.random().toString(36).substring(7)}/online`)
        .expect(200)

      assert.strictEqual(body.isOnline, false)
    })
  })

  describe('pushToUser', function () {
    it('Push to online user', async function () {
      let { body } = await request
        .post(`/users/${userId}/push`)
        .send({ a: 'aa', b: 'bb' })
        .expect(200)

      assert.strictEqual(body.count, 1)
    })

    it('Push to offline user', async function () {
      let { body } = await request
        .post(`/users/${Math.random().toString(36).substring(7)}/push`)
        .send({ a: 'aa', b: 'bb' })
        .expect(200)

      assert.strictEqual(body.count, 0)
    })
  })

  describe('pushToUsers', function () {
    it('Push to online users', async function () {
      let { body } = await request
        .post(`/users/push`)
        .send({ a: 'aa', b: 'bb', userIds: [userId, userId3] })
        .expect(200)

      assert.strictEqual(body.count, 2)
    })
  })
})
