'use strict'
const bll = require('../bll')
const { ERROR } = require('../util/error')
const validator = require('../util/validator')

/**
 * @swagger
 * tags:
 *   name: 示例模型
 *   description: 示例模型 API
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - 示例模型
 *     description: 创建示例模型
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: 示例模型
 *         description: 待创建示例模型的信息
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               description: 示例模型名
 *               type: string
 *     responses:
 *       200:
 *         description: 示例模型信息
 *         schema:
 *           $ref: '#/definitions/example'
 */
async function create (ctx) {
  let { name } = ctx.request.body

  if (!validator.isNotEmptyString(name)) {
    return ctx.throwAppError(ERROR.INVALID_PARAMS, 'name')
  }

  ctx.body = await bll.example.create({ name })
}

module.exports = {
  create
}
