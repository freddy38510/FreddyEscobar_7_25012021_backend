/* eslint-disable global-require */
const { mixin, Model } = require('objection');
const Authorize = require('objection-authorize');
const Unique = require('objection-unique');
const Slug = require('objection-slug');
const TimeStamp = require('objection-timestamps').timestampPlugin;
const Joi = require('joi');
const policies = require('../policies');
const knex = require('../database/knex');
const JoiValidator = require('./validations/JoiValidator');

Model.knex(knex);

class Post extends mixin(Model, [
  Authorize(policies, 'casl'),
  Unique({
    fields: ['slug'],
  }),
  Slug({
    sourceField: 'title',
    slugField: 'slug',
  }),
  TimeStamp(),
]) {
  static get tableName() {
    return 'posts';
  }

  static get timestamp() {
    return true;
  }

  static createValidator() {
    return new JoiValidator(this);
  }

  static get validationSchema() {
    return {
      id: Joi.number().positive(),
      user_id: Joi.number().positive(),
      title: Joi.string().required(),
      content: Joi.string().required(),
    };
  }

  $formatJson(json) {
    const formatedJson = super.$formatJson(json);

    delete formatedJson.id;
    delete formatedJson.user_id;

    if (formatedJson.commentsCount) {
      // cast to number because of how postgresql handle count
      formatedJson.commentsCount = Number(formatedJson.commentsCount);
    }

    return formatedJson;
  }

  static get modifiers() {
    return {
      selectSlug(builder) {
        builder.select('slug');
      },
      paging(query, page, pageSize) {
        const limit = pageSize && parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
        const offset = page && parseInt(page, 10) >= 0 ? parseInt(page, 10) : 0;

        query.page(offset, limit);
      },
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Comment = require('./Comment');

    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'posts.user_id',
          to: 'users.id',
        },
      },

      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'posts.id',
          to: 'comments.post_id',
        },
      },
    };
  }

  async getComments(user, { page, pageSize }) {
    return this.$relatedQuery('comments')
      .authorize(user)
      .withGraphJoined('[author(selectUsername)]')
      .modify('paging', page, pageSize)
      .orderBy('created_at', 'desc')
      .debug(true);
  }

  async insertComment(user, commentData) {
    const comment = await Post.transaction(async (trx) => this
      .$relatedQuery('comments', trx)
      .authorize(user)
      .insert({
        ...commentData,
        user_id: user.id,
        post_id: this.id,
      }));

    comment.author = {
      username: user.username,
    };

    return comment;
  }
}

module.exports = Post;
