const bcrypt = require("bcryptjs");
const path = require("path");
const jwt = require("jsonwebtoken");

const Topic = require("../models/topic");
const Domain = require("../models/domain");
const Area = require("../models/area");
const User = require("../models/user");
const Role = require("../models/role");
const Keyword = require("../models/keyword");
const Alias = require("../models/alias");
const Course = require("../models/course");
const { Op } = require("sequelize");

exports.getTopics = (req, res, next) => {
  if (req.query.areaId != "%") {
    Topic.findAll({ where: { areaId: req.query.areaId } })
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
};

exports.getSelectedTopics = (req, res, next) => {
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
        },
        "mysecretforecu",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser.id,
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
  Course.create({
    name: courseName,
    topics: topics,
    nodes: nodes,
    edges: edges,
  })
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCourses = (req, res, next) => {
  Course.findAll().then((courses) => {
    res.send(courses);
  });
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
  const domain = req.body.domain.id;
  const area = req.body.area.id;

  const topicId = req.body.topicId;
  const name = req.body.name;
  const contentFile = req.files["contentUpload"][0];
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
    .catch((err) => console.log(err));
};

exports.getUsers = (req, res, next) => {
  User.findAll().then((users) => {
    res.send(users);
  });
};

exports.getRoles = (req, res, next) => {
  Role.findAll().then((roles) => {
    res.send(roles);
  });
};

exports.getUser = (req, res, next) => {
  User.findOne({where:{id:req.userId}}).then((user) => {
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.roleId
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
      email?updatedUser.email = email:null;
      updatedUser.roleId = role;
    })
    .then(() => {
      return bcrypt.hash(password, 12);
    })
    .then((password) => {
      password?updatedUser.password = password:null;
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
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        roleId: role
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
      return bcrypt.hash(password, 12);
    })
    .then((password) => {
      password&&password!=''?updatedUser.password = password:null;
      updatedUser.save();
      return updatedUser;
    })
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => console.log(err));
};