'use strict'
const mongoose = require('mongoose')
const schemas = require('./schema')

const models = {}

for (const [schemaName, schema] of Object.entries(schemas)) {
  models[schemaName] = mongoose.model(schemaName, schema)
}

module.exports = models
