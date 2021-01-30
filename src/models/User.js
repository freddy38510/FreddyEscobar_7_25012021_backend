/* eslint-disable global-require */
const { mixin, Model } = require('objection');
const Authorize = require('objection-authorize');
const Unique = require('objection-unique');
const Password = require('objection-password')();
const TimeStamp = require('objection-timestamps').timestampPlugin;
const Joi = require('joi');
const policies = require('../policies');
const knex = require('../database/knex');
const JoiValidator = require('./validations/JoiValidator');
const { password, username } = require('../validations/custom.validation');

Model.knex(knex);

class User extends mixin(Model, [
  Authorize(policies, 'casl'),
  Password,
  Unique({
    fields: ['email', 'username'],
  }),
  TimeStamp(),
]) {
  static get tableName() {
    return 'users';
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
      email: Joi.string().email().required(),
      password: Joi.string().custom(password).required(),
      username: Joi.string().custom(username).required(),
      isModerator: Joi.boolean().optional(),
    };
  }

  $formatJson(json) {
    const formatedJson = super.$formatJson(json);

    delete formatedJson.password;
    delete formatedJson.id;

    return formatedJson;
  }

  static get modifiers() {
    return {
      selectUsername(builder) {
        builder.select('username');
      },
      maskEmail(builder) {
        builder.select('id', 'username', 'password', 'isModerator', 'created_at', 'updated_at');
      },
    };
  }

  static get relationMappings() {
    const Post = require('./Post');
    const Comment = require('./Comment');

    return {
      posts: {
        relation: Model.HasManyRelation,
        modelClass: Post,
        join: {
          from: 'users.id',
          to: 'posts.user_id',
        },
      },

      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'users.id',
          to: 'comments.user_id',
        },
      },
    };
  }

  async getPosts({ page, pageSize }) {
    return this.$relatedQuery('posts')
      .authorize(this)
      .withGraphJoined('[author(selectUsername)]')
      .modify('paging', page, pageSize)
      .orderBy('created_at', 'desc')
      .debug(true);
  }
}

module.exports = User;
