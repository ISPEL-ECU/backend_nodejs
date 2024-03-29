const bcrypt = require("bcryptjs");
const path = require("path");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("node-fetch");

const qgen = require('../controllers/question_generation');

const Topic = require("../models/topic");
const Domain = require("../models/domain");
const Area = require("../models/area");
const User = require("../models/user");
const Role = require("../models/role");
const Keyword = require("../models/keyword");
const Alias = require("../models/alias");
const Course = require("../models/course");
const ExCourse = require("../models/excourse");
const Question = require("../models/question");
const Quiz = require("../models/quiz");
const QuestionBank = require("../models/questionbank");
const QuestionFromBank = require("../models/bankquestions");
const Asset = require("../models/asset");


const { Op } = require("sequelize");
const { deleteFile } = require("../util/file");
const questionbank = require("../models/questionbank");

exports.getTopics = (req, res, next) => {
  if (req.query.areaId != "%") {
    Topic.findAll({ where: { areaId: req.query.areaId } })
      .then((topics) => {
        res.send(topics);
      })
      .catch((err) => console.log(err));
  } else if (req.query.manage) {
    if (req.authLevel!='1'){
    Topic.findAll({ where: { userId: req.userId } }) 
      .then((topics) => { 
        res.send(topics);
      })
      .catch((err) => console.log(err));
    } else {
      Topic.findAll() 
      .then((topics) => { 
        res.send(topics);
      })
      .catch((err) => console.log(err));
    }
  } else {
    Topic.findAll()
      .then((topics) => {
        res.send(topics);
      })
      .catch((err) => console.log(err));
  }
};

exports.postDeleteTopic = (req, res, next) =>{
  const topicId = req.query.id;
  Topic.findOne({where:{id: topicId}})
  .then((topic)=>{
    deleteFile(topic.contentHtml);
    topic.destroy().then(()=>{
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });  
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
}

exports.getSelectedTopics = (req, res, next) => {
  console.log("id" + req.query.id);
  Topic.findAll({ where: { id: req.query.id } })
    .then((topics) => {
      res.send(topics);
    })
    .catch((err) => console.log(err));
};

exports.getTopicsSearch = (req, res, next) => {
  Topic.findAll({
    where: {
      name: {
        [Op.iLike]: "%" + req.query.name + "%",
      },
    },
  })
    .then((topics) => {
      res.send(topics);
    })
    .catch((err) => console.log(err));
};

exports.getSelectedTopics = (req, res, next) => {
  console.log("id" + req.query.id);
  Topic.findAll({ where: { id: req.query.id } })
    .then((topics) => {
      res.send(topics);
    })
    .catch((err) => console.log(err));
};

exports.getDomains = (req, res, next) => {
  Domain.findAll()
    .then((domains) => {
      res.send(domains);
    })
    .catch((err) => console.log(err));
};

exports.getAreas = (req, res, next) => {
  Area.findAll({ where: { domainId: req.query.domainId } })
    .then((areas) => {
      res.send(areas);
    })
    .catch((err) => console.log(err));
};

exports.getDomainById = (req,res,next) =>{
  Area.findOne({where: {id: req.query.areaId}})
  .then((area)=>{
    const domainId = area.domainId.toString();
    res.send(domainId);
  })
  .catch(err=>
    console.log(err));
}

exports.getSelectedContent = (req, res, next) => {
  if (req.query.id && req.query.id !== "") {
    Topic.findOne({ where: { id: req.query.id } })
      .then((topic) => { 
        res.send(topic.contentHtml);
      })
      .catch((err) => console.log(err));
  } else {
    res.send("");
  }
};

exports.login = (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;
  let loadedUser;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        const error = new Error("No user with such email");
        error.statusCode = 401;
        throw err;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong credentials");
        error.statusCode = 401;
        throw error;
      }
      return isEqual;
    })
    .then(() => {
      return loadedUser.getRole();
    })
    .then((role) => {
      let authLevel = 3;

      if (role.roleCode < authLevel) authLevel = role.roleCode;

      return authLevel;
    })
    .then((authLevel) => {
      const token = jwt.sign(
        {
          firstName: loadedUser.firstName,
          userId: loadedUser.id,
          roleCode: authLevel,
        },
        "mysecretforecu",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser.id,
        userName: loadedUser.firstName + " " + loadedUser.lastName,
        authLevel: authLevel,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSaveCourse = (req, res, next) => {
  const courseName = req.query.courseName;
  const topics = req.query.topics;
  const nodes = req.query.nodes;
  const edges = req.query.edges;
  const topicsList = JSON.parse(topics);
  const filterFunction = (name) =>{
    return !name.startsWith('#')&&name!=='';
  }
  const filteredList = topicsList.filter(filterFunction);
  Course.create({
    name: courseName,
    topics_list: topics,
    nodes: null,
    edges: null,
  })
    .then((newCourse) => {
      Topic.findAll({
        where: {
          topicId: filteredList
        }
      }).then((foundTopics) =>{
      newCourse.setTopics(foundTopics)
      .then(()=>{
        res.send(true);
      })
      })

     // res.send(true);
    })
    
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSaveBankQuestions = (req, res, next) => {
  const QuestionText = req.body.QuestionText;
  const QuestionName = req.body.QuestionName;
  const correct = req.body.correct;
  const distractor1 = req.body.distractor1;
  const distractor2 = req.body.distractor2;
  const distractor3 = req.body.distractor3;
  QuestionFromBank.create({
    text: QuestionText,
    question_name: QuestionName,
    correct: correct,
    distractor1: distractor1,
    distractor2: distractor2,
    distractor3: distractor3
  })
  .then(() => {
    res.send(true);
  })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSaveQuestionBank = (req, res, next) => {
  const QuestionBankName = req.body.questionBankName;
  const teaser = req.body.teaser;
  QuestionBank.create({
    name: QuestionBankName,
    teaser: teaser
  })
  .then(() => {
    res.send(true);
  })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSaveExCourse = (req, res, next) => {
  const courseName = req.body.courseName;
  const topics = req.body.topics;
  const nodes = req.body.nodes;
  const edges = req.body.edges;
  ExCourse.create({
    name: courseName,
    topics: topics,
    nodes: nodes,
    edges: edges,
  })
    .then(() => {
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getQuestionBanks = (req, res, next) => {
  QuestionBank.findAll().then((questionbanks) => {
    res.send(questionbanks);
  });
};

exports.getQuestionList = (req, res, next) => {
  QuestionFromBank.findAll().then((questionbanks) => {
    res.send(questionbanks);
  });
};



exports.getCourses = (req, res, next) => {
  Course.findAll().then((courses) => {
    res.send(courses);
  });
};

exports.getExCourses = (req, res, next) => {
  ExCourse.findAll().then((courses) => {
    res.send(courses);
  });
};

exports.getCourse = (req, res, next) => {
  console.log("id" + req.query.id);
  Course.findOne({ where: { id: req.query.courseId } })
    .then((course) => {
      res.send(course);
    })
    .catch((err) => console.log(err));
};

exports.getExCourse = (req, res, next) => {
  console.log("id" + req.query.id);
  ExCourse.findOne({ where: { id: req.query.courseId } })
    .then((course) => {
      res.send(course);
    })
    .catch((err) => console.log(err));
};

exports.getKeywords = (req, res, next) => {
  Keyword.findAll().then((keywords) => {
    res.send(keywords);
  });
};
exports.getAliases = (req, res, next) => {
  Alias.findAll().then((aliases) => {
    res.send(aliases);
  });
};

exports.postSaveTopic = (req, res, next) => {
  const domain = req.body.domain ? req.body.domain.id : null;

  const area = req.body.area;

  const topicId = req.body.topicId;
  const name = req.body.name;
  const rmdFile =
    typeof req.files["rmdUpload"] !== "undefined"
      ? req.files["rmdUpload"][0]
      : null;
  const difficulty = req.body.difficulty;
  const keyword = req.body.keyword;
  const alias = req.body.alias;
  const paragraph = req.body.teaser;
  const private = req.body.private;
  const userId = req.userId;
  const changedId = req.body.changedId;
  console.log("changeId" + changedId);
  if (changedId) {
    const contentFile =
      typeof req.body.contentUpload === "string"
        ? req.body.contentUpload
        : req.files["contentUpload"][0].path;
    console.log(name);
    console.log(paragraph);
    console.log(contentFile);
    Topic.findOne({ where: { id: changedId } })
      .then((topic) => {
        console.log("found");
        if (contentFile!==topic.contentHtml){
          deleteFile(topic.contentHtml)
        }
        topic
          .update({
            name: name,
            teaser: paragraph,
            contentHtml: contentFile,
          })
          .then(() => {
            console.log("after update");
            res.send(true);
          });
      })
      .catch((err) => console.log(err));
  } else {
    const contentFile = req.files["contentUpload"][0];
    Topic.create({
      domain: domain,
      areId: area,
      difficulty: difficulty,
      topicId: topicId,
      name: name,
      teaser: paragraph,
      contentHtml: contentFile.path,
      contentRmd: rmdFile ? rmdFile.path : null,
      isPrivate: private,
      userId: userId,
    })
      .then((newTopic) => {
        newTopic.setUser(userId);
        return newTopic;
      })
      .then((newTopic) => {
        newTopic.addKeyword(keyword);
        return newTopic;
      })
      .then((newTopic) => {
        newTopic.addAlias(alias);
        return newTopic;
      })
      .then((newTopic) => {
        newTopic.setArea(area);
      })
      .then(() => res.send(true))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
};

exports.getUsers = (req, res, next) => {
  User.findAll({
    order: ["lastName"],
  }).then((users) => {
    res.send(users);
  });
};

exports.getRoles = (req, res, next) => {
  Role.findAll().then((roles) => {
    res.send(roles);
  });
};

exports.getUser = (req, res, next) => {
  User.findOne({ where: { id: req.userId } }).then((user) => {
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.roleId,
    });
  });
};

exports.postUser = (req, res, next) => {
  let updatedUser;
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  User.findOne({
    where: {
      id: userId,
    },
  })
    .then((user) => {
      updatedUser = user;
      updatedUser.firstName = firstName;
      updatedUser.lastName = lastName;
      email ? (updatedUser.email = email) : null;
      updatedUser.roleId = role;
    })
    .then(() => {
      return bcrypt.hash(password, 12);
    })
    .then((password) => {
      password ? (updatedUser.password = password) : null;
      updatedUser.save();
      return updatedUser;
    })
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => console.log(err));
};

exports.postAddUser = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  console.log(firstName);
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        roleId: role,
      });
    })
    .then((user) => {
      user.save();

      return user;
    })
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => console.log(err));
};

exports.postAccount = (req, res, next) => {
  let updatedUser;
  const userId = req.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const role = req.body.role;
  User.findOne({
    where: {
      id: userId,
    },
  })
    .then((user) => {
      updatedUser = user;
      updatedUser.firstName = firstName;
      updatedUser.lastName = lastName;
      updatedUser.roleId = role;
    })
    .then(() => {
      return password && password != "" ? bcrypt.hash(password, 12) : null;
    })
    .then((password) => {
      password && password != "" ? (updatedUser.password = password) : null;
      updatedUser.save();
      return updatedUser;
    })
    .then((user) => {
      console.log(user);
      res.status(200).send();
    })
    .catch((err) => console.log(err));
};

const shuffleArray = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array; 
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}






exports.getQuestions = (req, res, next) => {
  let initialSets;
  let shuffledResults;
  const quizId = req.query.quizId;
  const difficulty = req.query.difficulty;
  Quiz.findOne({ where: { id: quizId } })
    .then((quiz) => {
      if (quiz.question=="questionBank"){
        QuestionBank.findOne({where: {id: quiz.url}})
        .then(bank =>{
          const questionsList = bank.getBankquestions();
          return (questionsList)
        })
        .then(questionsList =>{
          const currentQuestion = questionsList[getRandomInt(questionsList.length)];
          if (currentQuestion) {
            const answerString = currentQuestion.correct;
            Question.create({ value: answerString }).then((question) => {
              let results = new Array();
              results.push(currentQuestion.correct);
              results.push(currentQuestion.distractor1);
              results.push(currentQuestion.distractor2);
              results.push(currentQuestion.distractor3);
              const shuffledResults = shuffleArray(results);
              const dataSet = {
                id: question.id,
                // title: initialSets.shift().toString(),
                initialSets: [currentQuestion.text],
                results: shuffledResults,
                  
              };
              console.log(dataSet);
              res.status(200).send(dataSet)
            })
            .catch((err) => console.log(err));
          }  
        })



       
          
      } else if(quiz.question=="autoGen") {
      fetch("http://localhost:4221/" + quiz.url, { method: 'POST', body: "difficulty: ["+difficulty+"]"})
        .then((response) => {
          return response.json(); 
        })
        .then((data) => {
          if (data.format[0]==='2'){
            res.status(200).send({'format':2, 'graph':JSON.parse(data.question)});
          }
          var questionInfo = (data);
          console.log(questionInfo);
          initialSets = questionInfo.question.content;
          let results = new Array();
          results.push(questionInfo.question.correct);
          results = results.concat(questionInfo.question.distractors);
          const answer = questionInfo.question.correct;
          shuffledResults = shuffleArray(results);
          return answer;
        })  
        .then((answer) => {
          const answerString = answer.length>256?nswer.toString().slice(0,256):answer.toString();
          Question.create({ value: answerString }).then((question) => {
            const dataSet = {
              id: question.id,
              // title: initialSets.shift().toString(),
              initialSets: initialSets,
              results: shuffledResults,
                
            };
            console.log(dataSet);
            res.status(200).send(dataSet);
          });
        }) .catch((err) => console.log(err));
    } else {
      let questionBody = qgen[quiz.url]()
      
      const answerString = questionBody["correctAnswer"];
      Question.create({ value: answerString }).then((question) => {
        let results = new Array();
        results.push(questionBody["correctAnswer"]);
        results.push(questionBody["distractor1"]);
        results.push(questionBody["distractor2"]);
        results.push(questionBody["distractor3"]);
        const shuffledResults = shuffleArray(results);
        const dataSet = {
          id: question.id,
          // title: initialSets.shift().toString(),
          initialSets: [questionBody["text"]],
          hint: questionBody["hint"],
          results: shuffledResults,
            
        };
        console.log(dataSet);
        res.status(200).send(dataSet)

      }) }
  
})};

exports.getCorrectAnswer = (req, res, next) => {
  const id = req.query.id;
  const currentAnswer = req.query.answer;
  Question.findOne({ where: { id: id } })
    .then((question) => {
      let correct = false;
      if (question.value === currentAnswer) correct = true;
      const correctAnswer = question.value;
      question.destroy();
      res.status(200).send({ correct: correct, correctAnswer: correctAnswer });
    })
    .catch((err) => console.log(err));
};

exports.getQuizExistForTopic = (req, res, next) => {
  const topicId = req.query.topicId;
  if (topicId) {
    Topic.findOne({ where: { id: topicId } })
      .then((topic) => {
        return topic.getQuiz();
      })
      .then((quiz) => {
        if (quiz) {
          res.status(200).send({ quizId: quiz.id });
        } else {
          res.status(200).send(false);
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.getTopic = (req, res, next) => {
  const id = req.query.id;
  Topic.findOne({ where: { id: id } })
    .then((topic) => {
      console.log(topic);
      res.send(topic);
    })
    .catch((err) => console.log(err));
};

async function getTopics(metaTipics) {}

exports.getTopicsByComplexId = async (req, res, next) => {
  const metaTopics = req.query.ids;
  const result = [];
  for (let i = 0; i < metaTopics.length; i++) {
    let resultTopic = metaTopics[i];
    if (resultTopic.startsWith('#')){
      result.push({type: "header", value:resultTopic});
    } else {
      await Topic.findOne({where:{topicId: resultTopic}})
      .then((topic)=>{
        result.push({type: "topic", value:topic, id: resultTopic});
      })
      .catch(err => console.log(err));
    }
  } 


  // for (let i = 0; i < metaTopics.length; i++) {
  //   let resultTopic = JSON.parse(metaTopics[i]);
  //   await Topic.findAll({ where: { topicId: resultTopic.topics } }).then(async (processedTopics) => {
  //       await Area.findOne({where:{id:processedTopics[0].areaId}}).then((area) =>{
  //       result.push({ name: resultTopic.name, topics: processedTopics, areaName: area.name });
  //       }
  //       )
  //     }
  //   );
  // }

  res.send(result);
};


exports.postSaveQuestionsToQuestionBank = (req, res, next) => {
  const questionBank = req.body.questionBank;
  const questions = req.body.questions.split(',');
  
  QuestionFromBank.findAll({where:{id:questions}}).then((qns)=>{

    QuestionBank.findOne({where:{id:questionBank}}).then((qb)=>{
      qb.addBankquestions(qns).then(()=>{
      res.status(200).send(true);
    })
    .catch((err) => console.log(err))
  })
  .catch((err) => console.log(err))
})
    .catch((err) => console.log(err));

  // const email = req.body.email;
  // const password = req.body.password;
  // const role = req.body.role;
  // console.log(firstName);
  // bcrypt
  //   .hash(password, 12)
  //   .then((hashedPassword) => {
  //     return new User({
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       password: hashedPassword,
  //       roleId: role,
  //     });
  //   })
  //   .then((user) => {
  //     user.save();

  //     return user;
  //   })
  //   .then((user) => {
  //     console.log(user);
  //     res.send(user);
  //   })
  //   .catch((err) => console.log(err));
};

exports.getCoursesWithTopics = (req, res, next) => {
  Course.findAll({
    include: [
      {
        model: Topic,
        as: 'topics',
      },
    ],
  })
    .then((courses) => {
      // res.send(courses);
    User.findOne({ where: { id: req.userId } })
    .then((user) => {
      return user.getTopics();
      
    })
    .then((topics) => {
      return topics.map(topic => topic.id);
    })
    .then((topics) => {
      const coursesWithTopics = courses.map(course => {
        const completedTopics = course.topics.filter(topic => topics.includes(topic.id));
        const completedId = completedTopics.map(topic => topic.id);
        const completedTopicIds = completedTopics.map(topic => topic.topicId)
        const topics_list = JSON.parse(course.topics_list).map(topic => {
          if (topic.startsWith('#')){
            return({type: "header", value:topic});
          } else {
            return({type: "topic", value:course.topics.find(tp=>{return tp.topicId==topic}), id: topic});
            }
          
          })
        return {
          id: course.id,
          name: course.name,
          topics: course.topics,
          completedTopics: completedId,
          completedTopicIds: completedTopicIds,
          topics_list: topics_list
        };
      })
      res.send(coursesWithTopics);
    })
    //   .then((completedTopics)=>{
    //   const result = [];
    //   result.push(courses);
    //   result.push(completedTopics);
    //   res.send(result);
    // })
    })
    .catch((err) => console.log(err));
};

exports.postUserTopic = (req, res, next) => {

  const topicId = req.body.topicId;

  const userId = req.userId;

  Topic.findOne({ where: { id: topicId } })

    .then((topic) => {

      User.findOne({ where: { id: userId } })

        .then((user) => {

          topic.addUser(user);

        })

    })

}

exports.getUserTopics = (req, res, next) => {
  
    const userId = req.userId;
  
    User.findOne({ where: { id: userId } })
  
      .then((user) => {
  
        return user.getTopics();
  
      })
  
      .then((topics) => {
  
        res.send(topics);
  
      })
  
      .catch((err) => console.log(err));
  
  }

  exports.postSaveDomain = (req, res, next) => {
    const domain = req.body.domain;
    const shortName = req.body.shortName;
   Domain.create({
    name: domain,
    shortName: shortName
  }).then((domain)=>{
    res.send(domain);
  })
  }

  exports.getAssetsForTopic = (req, res, next) => {
    const topicId = req.query.topicId;
    Topic.findOne({where:{id:topicId}}).then((topic)=>{
      topic.getAssets().then((assets)=>{
        res.send(assets);
      })
      
    })
  }

  exports.postSaveAsset = (req, res, next) => {
    const assetName = req.body.name;
    const contentFile = req.files["contentUpload"][0];
    Asset.create({
      name: assetName,
      contentHtml: contentFile.path,
    }).then((asset)=>{
      res.send(asset);
    }).catch((err)=>{
      console.log(err);
    });

  }

  exports.getAssets = (req, res, next) => {
    Asset.findAll().then((assets)=>{
      res.send(assets);
    })
  }

  exports.postSaveAssetToTopic = (req, res, next) => {
    const topicId = req.body.topicId;
    const assetId = req.body.assetId;
    Topic.findOne({where:{id:topicId}}).then((topic)=>{
      Asset.findOne({where:{id:assetId}}).then((asset)=>{
        topic.addAsset(asset);
        res.send(true);
      })
    })
  }
