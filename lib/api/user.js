'use strict'
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
 *     description: Push message to specified user.
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

async function pushToUsers (ctx) {

}

module.exports = {
  isOnline,
  pushToUser,
  pushToUsers
}
