/* global describe before */
'use strict'
require('mocha')
const glob = require('glob')
const pkg = require('../package')
const { initDB } = require('./helper/db')

describe(pkg.name, function () {
  before(async function () {
    await initDB()
  })

  glob.sync(`${__dirname}/api/**/*.js`).forEach(require)
})
