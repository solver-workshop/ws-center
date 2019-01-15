'use strict'

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
  ctx.body = null
}

module.exports = {
  isOnline
}
