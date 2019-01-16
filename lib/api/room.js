'use strict'
const bll = require('../bll')
const { createAppError, ERROR } = require('../util/error')

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: Room API
 */

/**
 * @swagger
 * /rooms/{roomName}/join:
 *   post:
 *     tags:
 *       - Room
 *     description: Join the specified room.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roomName
 *         description: Room Name
 *         in: path
 *         required: true
 *         type: string
 *       - name: userIds
 *         description: User IDs, splited by comma.
 *         in: query
 *         required: true
 *         type: array
 *           items:
 *             type: string
 *     responses:
 *       204:
 *         description: Join the room successfully.
 */
async function join (ctx) {
  const { roomName } = ctx.params
  let { userIds } = ctx.query

  if (!userIds || !userIds.length) {
    throw createAppError(ERROR.INVALID_PARAMS, 'userIds', userIds)
  }

  if (!roomName) {
    throw createAppError(ERROR.INVALID_PARAMS, 'roomName', roomName)
  }

  await bll.room.join(userIds.split(','), roomName)

  ctx.body = null
}

/**
 * @swagger
 * /rooms/{roomName}/leave:
 *   del:
 *     tags:
 *       - Room
 *     description: Leave the specified room.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roomName
 *         description: Room Name
 *         in: path
 *         required: true
 *         type: string
 *       - name: userIds
 *         description: User IDs, splited by comma.
 *         in: query
 *         required: true
 *         type: array
 *           items:
 *             type: string
 *     responses:
 *       204:
 *         description: Leave the room successfully.
 */
async function leave (ctx) {
  const { roomName } = ctx.params
  let { userIds } = ctx.query

  if (!userIds || !userIds.length) {
    throw createAppError(ERROR.INVALID_PARAMS, 'userIds', userIds)
  }

  if (!roomName) {
    throw createAppError(ERROR.INVALID_PARAMS, 'roomName', roomName)
  }

  await bll.room.leave(userIds.split(','), roomName)

  ctx.body = null
}

/**
 * @swagger
 * /rooms/{roomName}/push:
 *   post:
 *     tags:
 *       - Room
 *     description: Push message to all users in the specified room.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roomName
 *         description: Room Name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           $ref: '#/definitions/pushCountRes'
 */
async function push (ctx) {

}

module.exports = {
  join,
  leave,
  push
}
