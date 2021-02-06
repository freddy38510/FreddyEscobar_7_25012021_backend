const { Post } = require('../models');
/**
 * Create a post
 * @param {Object} postBody
 * @param {ObjectId} userId
 * @returns {Promise<Post>}
 */
const createPost = async (user, postBody) => Post
  .query()
  .authorize(user)
  .insert({
    ...postBody,
    user_id: user.id,
  });

/**
 * Query for posts
 * @returns {Promise<QueryResult>}
 */
const queryPosts = async ({ page, pageSize }) => Post
  .query()
  .select('posts.*', Post.relatedQuery('comments').count().as('commentsCount'))
  .withGraphJoined('[author(selectUsername)]')
  .modify('paging', page, pageSize)
  .orderBy('created_at', 'desc');

/**
 * Query for posts by username
 * @returns {Promise<QueryResult>}
 */
const queryPostsByUsername = async (username, { page, pageSize }) => Post
  .query()
  .whereExists(
    Post.relatedQuery('author').where('username', username),
  )
  .modify('paging', page, pageSize)
  .orderBy('created_at', 'desc');

/**
 * Query for posts by userId
 * @returns {Promise<QueryResult>}
 */
const queryPostsByUserId = async (userId, { page, pageSize }) => Post
  .query()
  .where('author', userId)
  .modify('paging', page, pageSize)
  .orderBy('created_at', 'desc');

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => Post.query().findById(id).throwIfNotFound();

/**
 * Get post by slug
 * @param {string} slug
 * @returns {Promise<Post>}
 */
const getPostBySlug = async (slug) => Post
  .query()
  .findOne({ slug })
  .throwIfNotFound()
  .select('posts.*', Post.relatedQuery('comments').count().as('commentsCount'))
  .withGraphJoined('[author(selectUsername)]')
  .debug(true);

/**
 * Update post by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @param {ObjectId} authUser
 * @returns {Promise<Post>}
 */
const updatePostById = async (postId, updateBody, authUser) => Post
  .query()
  .authorize(authUser)
  .patchAndFetchById(postId, updateBody)
  .throwIfNotFound()
  .fetchResourceContextFromDB()
  .returning('*');

/**
 * Update post by slug
 * @param {ObjectId} slug
 * @param {Object} updateBody
 * @param {ObjectId} authUser
 * @returns {Promise<Post>}
 */
const updatePostBySlug = async (slug, updateBody, authUser) => {
  const post = await Post
    .query()
    .where('slug', slug)
    .first()
    .throwIfNotFound();

  return post
    .$query()
    .patch(updateBody)
    .authorize(authUser);
};

/**
 * Delete post by id
 * @param {ObjectId} postId
 * @param {ObjectId} authUser
 * @returns {Promise<Post>}
 */
const deletePostById = async (postId, authUser) => Post
  .query()
  .authorize(authUser)
  .findById(postId)
  .throwIfNotFound()
  .delete()
  .fetchResourceContextFromDB()
  .returning('*');

/**
 * Delete post by id
 * @param string slug
 * @param {ObjectId} authUser
 * @returns {Promise<Post>}
 */
const deletePostBySlug = async (slug, authUser) => Post
  .query()
  .authorize(authUser)
  .where('slug', slug)
  .first()
  .throwIfNotFound()
  .delete()
  .fetchResourceContextFromDB()
  .returning('*')
  .first();

module.exports = {
  createPost,
  queryPosts,
  queryPostsByUserId,
  queryPostsByUsername,
  getPostById,
  getPostBySlug,
  updatePostById,
  updatePostBySlug,
  deletePostById,
  deletePostBySlug,
};
