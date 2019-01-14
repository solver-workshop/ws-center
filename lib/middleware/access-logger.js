'use strict'
const logger = require('ilog')

module.exports = async function (ctx, next) {
  let start = new Date()

  try {
    await next()
  } catch (err) {
    if (err.status && err.status < 500) _log(ctx, start, err)
    throw err
  }

  let onEnd = done.bind(ctx)

  ctx.res.once('finish', onEnd)
  ctx.res.once('close', onEnd)

  function done () {
    ctx.res.removeListener('finish', onEnd)
    ctx.res.removeListener('close', onEnd)
    _log(ctx, start)
  }
}

function _log (ctx, startTime, err = {}) {
  let logInfo = {
    ip: ctx.ip,
    method: ctx.method.toUpperCase(),
    url: ctx.url,
    status: err.status || ctx.status,
    time: new Date() - startTime,
    user: ctx.state.user ? ctx.state.user.id : null
  }

  logger.info(logInfo)
}
