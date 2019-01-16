'use strict'

function promisify (object, method, ...args) {
  return new Promise(function (resolve, reject) {
    object[method](...args, function (error, result) {
      if (error) return reject(error)

      return resolve(result)
    })
  })
}

module.exports = {
  promisify
}
