'use strict'
const db = require('../model')

// 创建示例模型
async function create ({ name }) {
  const example = await db.example.create({ name })

  return example
}

module.exports = {
  create
}
