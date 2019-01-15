/* global describe */
'use strict'
require('mocha')
const glob = require('glob')
const pkg = require('../package')

describe(pkg.name, function () {
  glob.sync(`${__dirname}/api/**/*.js`).forEach(require)
})
