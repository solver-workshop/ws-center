'use strict'
const _ = require('lodash')
const bll = require('../bll')
const { createAppError, ERROR } = require('../util/error')

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API
 */

/**
 * @swagger
 * definitions:
 *   userOnlineInfo:
 *     type: object
 *     description: User
 *     properties:
 *       isOnline:
 *         type: boolean
 *         description: Whether this user is online
 */

/**
 * @swagger
 * /users/{userId}/online:
 *   get:
 *     tags:
 *       - User
 *     description: Check whether the user is online.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: User ID
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/userOnlineInfo'
 */
async function isOnline (ctx) {
  const { userId } = ctx.params

  if (!userId) {
    throw createAppError(ERROR.INVALID_PARAMS, 'userId')
  }

  ctx.body = {
    isOnline: await bll.user.isOnline(userId)
  }
}

/**
 * @swagger
 * definitions:
 *   pushCountRes:
 *     type: object
 *     description: User
 *     properties:
 *       count:
 *         type: integer
 *         description: The count of pushed users.
 */

/**
 * @swagger
 * /users/{userId}/push:
 *   post:
 *     tags:
 *       - User
 *     description: Push message to specified user. All the request body JSON will be send.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: User ID
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/pushCountRes'
 */
async function pushToUser (ctx) {
  const body = ctx.request.body
  const { userId } = ctx.params

  if (!body || !Object.keys(body).length) {
    throw createAppError(ERROR.INVALID_PARAMS, 'body')
  }

  if (!userId) {
    throw createAppError(ERROR.INVALID_PARAMS, 'userId', userId)
  }

  ctx.body = {
    count: await bll.user.pushMessageToUsers([userId], body)
  }
}

/**
 * @swagger
 * /users/push:
 *   post:
 *     tags:
 *       - User
 *     description: Push message to all specified users. All the request body JSON will be send.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: 分类信息
 *         description: 待创建分类的信息
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - userIds
 *           properties:
 *             userIds:
 *               description: User IDs
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/pushCountRes'
 */
async function pushToUsers (ctx) {
  const body = ctx.request.body

  if (!body || !Object.keys(body).length) {
    throw createAppError(ERROR.INVALID_PARAMS, 'body')
  }

  if (!body.userIds || !Array.isArray(body.userIds)) {
    throw createAppError(ERROR.INVALID_PARAMS, 'userIds', body.userIds)
  }

  ctx.body = {
    count: await bll.user.pushMessageToUsers(body.userIds, _.omit(body, 'userIds'))
  }
}

module.exports = {
  isOnline,
  pushToUser,
  pushToUsers
}
