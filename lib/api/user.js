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

module.exports = {
  isOnline
}
