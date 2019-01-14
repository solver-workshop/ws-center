'use strict'
const { Schema } = require('mongoose')

/**
 * @swagger
 * definitions:
 *   example:
 *     type: object
 *     description: 示例模型
 *     properties:
 *       _id:
 *         type: string
 *         description: 模型 ID
 *       name:
 *         type: string
 *         description: 模型名称
 *       createdAt:
 *         type: string
 *         description: 创建时间
 */
module.exports = new Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
}, {
  read: 'secondaryPreferred'
})
