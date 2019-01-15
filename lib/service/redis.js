'use strict'
const Redis = require('ioredis')
const config = require('config')
const ilog = require('ilog')

const redis = new Redis(config.redis)

redis.on('error', function (error) {
  ilog.error({ class: 'redisError', message: error.message, stack: error.stack })
})

module.exports = redis
