/* eslint-disable no-unused-vars */
const { AbilityBuilder, Ability } = require('@casl/ability');

function acl(user, resource, action, body, opts) {
  const { can, rules } = new AbilityBuilder(Ability);

  if (!user) {
    can('create', 'User');
    return new Ability(rules);
  }

  if (user.isModerator) {
    can('manage', 'all');
    return new Ability(rules);
  }

  can('read', 'all');

  can('update', 'User', { id: user.id });
  can('delete', 'User', { id: user.id });

  can('create', 'Post');
  can('update', 'Post', ['title', 'content'], { user_id: user.id });
  can('delete', 'Post', { user_id: user.id });

  can('create', 'Comment');
  can('update', 'Comment', ['content', 'updated_at'], { user_id: user.id });
  can('delete', 'Comment', { user_id: user.id });

  return new Ability(rules);
}

module.exports = acl;
