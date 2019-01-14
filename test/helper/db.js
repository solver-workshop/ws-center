'use strict'
const db = require('../../lib/model')

async function initDB () {
  await Promise.all([
    db.example.remove({})
  ])
}

module.exports = {
  initDB
}
