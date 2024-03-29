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
const Asset = require('../models/asset');
const QuestionBank = require("../models/questionbank");
const QuestionFromBank = require("../models/bankquestions");

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
  Topic.belongsToMany(QuestionBank, {
    through: "topic-qb"
  });
  QuestionBank.belongsToMany(Topic, {
    through: "topic-qb"
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
  User.belongsToMany(Topic, {
    through: "UserTopics"
  });
  Topic.belongsToMany(User, {
    through: "UserTopics"
  });
  QuestionBank.belongsToMany(QuestionFromBank, {
    through: "QBQ"
  });
  QuestionFromBank.belongsToMany(QuestionBank, {
    through: "QBQ"
  });

  Course.belongsToMany(Topic, {
    through: "course-topic"
  });
  Topic.belongsToMany(Course,{
    through: "course-topic"
  });

  Topic.belongsToMany(Asset, {
    through: "topic-asset"
    });
  Asset.belongsToMany(Topic, {
    through: "topic-asset"
    });

  QuestionBank.sync({alter: true});
  QuestionFromBank.sync({alter: true});
 //Course.sync({alter: true});
 // Question.sync({alter: true});
  // User.sync({ alter: true });
  // Role.sync({ alter: true });
 //Course.sync({ force: true });
  // Quiz.sync({ alter: true });
  // Topic.sync({ alter: true });
  
  

  // Role.create({roleName : "Admin", roleCode : "admin"});
  // Role.create({roleName : "Faculty", roleCode : "fct"});
  // Role.create({roleName : "Student", roleCode : "fct"});

  

 

} 

module.exports={define};