'use strict'
const createError = require('http-errors')

const ERROR = {
  INVALID_PARAMS: { status: 400, name: 'invalidParameters' },
  RESOURCE_NOT_FOUND: { status: 404, name: 'resourceNotFound' },
  REQUEST_NOT_ACCEPTABLE: { status: 406, name: 'requestNotAcceptable' },
  LENGTH_REQUIRED: { status: 411, name: 'lengthRequired' },
  NO_PERMISSION: { status: 403, name: 'noPermission' },
  UNAUTHORIZED: { status: 401, name: 'unauthorized' },
  EXCEED_LIMIT: { status: 400, name: 'exceedLimit' }
}

function createAppError (error, message) {
  if (message && Array.isArray(message)) message = message.join(', ')
  if (message && Buffer.isBuffer(message)) message = message.toString()

  return createError(error.status, {
    name: error.name,
    message: message || null
  })
}

module.exports = {
  ERROR,
  createAppError
}
