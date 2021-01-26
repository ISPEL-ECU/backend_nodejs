const Topic = require('../models/topic');
const Keyword = require('../models/keyword');
const TopicKeyword = require('../models/topic-keyword');
const Alias = require('../models/alias');
const TopicAlias = require('../models/topic-alias');
const Domain = require('../models/domain');
const Area = require('../models/area');
const User = require('../models/user');
const UserDomain = require('../models/user-domain');


//Relationships between models
function define(){
Topic.belongsToMany(Keyword, {
    through: TopicKeyword
  });
  Keyword.belongsToMany(Topic, {
    through: TopicKeyword
  });
  Topic.belongsToMany(Alias, {
    through: TopicAlias
  });
  Alias.belongsToMany(Topic, {
    through: TopicAlias
  });
  Area.belongsTo(Domain);
  Topic.belongsTo(Area);
  Topic.belongsTo(User);

  User.belongsToMany(Domain, {
    through: UserDomain
  });
  Domain.belongsToMany(User, {
    through: UserDomain
  });
}

module.exports={define};