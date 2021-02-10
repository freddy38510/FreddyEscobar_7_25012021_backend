const { Comment } = require('../models');

/**
* Query for comments
 * @param {Object} paging
 * @param {number} paging.page - Current page (default = 0)
 * @param {number} paging.pageSize - Maximum number of results per page (default = 10)
* @returns {Promise<QueryResult>}
*/
const queryComments = async ({ page, pageSize }) => Comment
  .query()
  // .select('content')
  .withGraphJoined('[author(selectUsername), post(selectSlug)]')
  .modify('paging', page, pageSize)
  .orderBy('created_at');

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => Comment.query().findById(id).throwIfNotFound();

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @param {ObjectId} authUser
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody, authUser) => Comment
  .query()
  .findById(commentId)
  .patch(updateBody)
  .throwIfNotFound()
  .fetchResourceContextFromDB()
  .authorize(authUser)
  .returning('*');

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @param {ObjectId} authUser
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId, authUser) => Comment
  .query()
  .authorize(authUser)
  .findById(commentId)
  .throwIfNotFound()
  .delete()
  .fetchResourceContextFromDB();

module.exports = {
  queryComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
