const Topic = require('../models/topic');
const Keyword = require('../models/keyword');
const TopicKeyword = require('../models/topic-keyword');
const Alias = require('../models/alias');
const TopicAlias = require('../models/topic-alias');
const Domain = require('../models/domain');
const Area = require('../models/area');
const User = require('../models/user');
const UserDomain = require('../models/user-domain');
const Role = require('../models/role');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Course = require('../models/course');


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
  
  Topic.belongsTo(Quiz);
  
  Role.hasMany(User);
  User.belongsTo(Role);
 // Course.sync({alter: true});
 // Question.sync({alter: true});
  // User.sync({ alter: true });
  // Role.sync({ alter: true });
  // Topic.sync({ alter: true });
  // Quiz.sync({ alter: true });
  
  
  

  // Role.create({roleName : "Admin", roleCode : "admin"});
  // Role.create({roleName : "Faculty", roleCode : "fct"});
  // Role.create({roleName : "Student", roleCode : "fct"});

}

module.exports={define};