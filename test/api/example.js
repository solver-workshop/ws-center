/* global describe it before */
'use strict'
const request = require('supertest')(require('../../lib/app'))
const assert = require('power-assert')
const { initDB } = require('../helper/db')

describe('api - example', function () {
  before(async function () {
    await initDB()
  })

  describe('example', function () {
    it('200', async function () {
      assert.strictEqual(true, true)

      const { body } = await request
        .post('/examples')
        .send({ name: 'name' })
        .expect(200)

      assert.strictEqual(body.name, 'name')
    })
  })
})
