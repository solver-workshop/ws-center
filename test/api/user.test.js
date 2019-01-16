/* global describe it before */
'use strict'
const request = require('supertest')(require('../../lib/app'))
const assert = require('power-assert')
const SocketClient = require('socket.io-client')
const ilog = require('ilog')

describe('api - user', function () {
  let userId
  before(function (callback) {
    userId = Math.random().toString(36).substring(7)

    const client = SocketClient('http://localhost:9001', {
      query: { userId },
      path: '/ws'
    })

    client.on('connect', function () {
      ilog.debug({ class: 'client-connect', message: client.connected })
      callback()
    })
  })

  describe('isOnline', function () {
    it('Online User', async function () {
      let { body } = await request
        .get(`/users/${userId}/online`)
        .expect(200)

      assert.strictEqual(body.isOnline, true)
    })
  })
})
