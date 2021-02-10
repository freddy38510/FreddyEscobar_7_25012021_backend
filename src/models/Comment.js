/* eslint-disable global-require */
const { mixin, Model } = require('objection');
const Authorize = require('objection-authorize');
const TimeStamp = require('objection-timestamps').timestampPlugin;
const Joi = require('joi');
const policies = require('../policies');
const knex = require('../database/knex');
const JoiValidator = require('./validations/JoiValidator');

Model.knex(knex);

class Comment extends mixin(Model, [
  Authorize(policies, 'casl'),
  TimeStamp(),
]) {
  static get tableName() {
    return 'comments';
  }

  static get timestamp() {
    return true;
  }

  static createValidator() {
    return new JoiValidator();
  }

  static get validationSchema() {
    return {
      id: Joi.number().positive(),
      user_id: Joi.number().positive(),
      post_id: Joi.number().positive(),
      content: Joi.string().required(),
    };
  }

  $formatJson(json) {
    const formatedJson = super.$formatJson(json);

    delete formatedJson.user_id;
    delete formatedJson.post_id;

    return formatedJson;
  }

  static get modifiers() {
    return {
      count(query) {
        query.count().groupBy('post_id');
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
    const Post = require('./Post');

    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comments.user_id',
          to: 'users.id',
        },
      },

      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: 'comments.post_id',
          to: 'posts.id',
        },
      },
    };
  }
}

module.exports = Comment;
