const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const pick = require('../utils/pick');

const getComments = catchAsync(async (req, res) => {
  const paging = pick(req.query, ['page', 'pageSize']);

  const comments = await commentService.queryComments(paging);

  res.send(comments);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getComment(req.params.commentId);

  res.send(comment);
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body, req.user);

  res.send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId, req.user);

  res.status(204).send();
});

module.exports = {
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
