'use strict'
const { createAppError, ERROR } = require('../util/error')
const logger = require('ilog')

const ERROR_NAME_LIST = Object
  .keys(ERROR)
  .map(function (errorName) { return ERROR[errorName].name })

module.exports = async function (ctx, next) {
  try {
    ctx.throwAppError = function (error, message) {
      ctx.throw(createAppError(error, message))
    }

    await next()
  } catch (error) {
    if (error.status && ERROR_NAME_LIST.includes(error.name)) {
      ctx.status = error.status
      ctx.body = { name: error.name, message: error.message || null }

      logger.debug(ctx.body)
    } else {
      throw error
    }
  }
}
