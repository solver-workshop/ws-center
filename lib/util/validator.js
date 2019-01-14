'use strict'
const _ = require('lodash')
const validator = require('validator')

function isNotEmptyString (str) {
  if (typeof str !== 'string') return false
  if (!str.length) return false

  return true
}

function isIntString (str) {
  if (typeof str !== 'string') return false
  if (!str.length) return false

  return _.isInteger(Number(str))
}

function isMongoId (str) {
  if (typeof str !== 'string') return false
  if (!validator.isMongoId(str)) return false

  return true
}

function isISODateString (str) {
  if (typeof str !== 'string' || !str.length) return false
  if (!validator.isISO8601(str)) return false

  return true
}

function isMongoIdArray (arr) {
  if (!Array.isArray(arr)) return false

  for (const item of arr) {
    if (!validator.isMongoId(item)) return false
  }

  return true
}

function isNumberArray (arr) {
  if (!Array.isArray(arr)) return false

  for (const item of arr) {
    if (!_.isNumber(item)) return false
  }

  return true
}

module.exports = {
  isNotEmptyString,
  isIntString,
  isMongoId,
  isISODateString,
  isMongoIdArray,
  isNumberArray
}
