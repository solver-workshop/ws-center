'use strict'
const pkg = require('../package')
const api = require('./api')

module.exports = function (router) {
  router.get('/', async function (ctx) {
    ctx.body = {
      name: pkg.name,
      version: pkg.version
    }
  })

  router.post('/examples', api.example.create)
}
