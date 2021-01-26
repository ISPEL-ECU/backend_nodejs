const nodePandoc = require('node-pandoc');

//import data models
const Keyword = require('../models/keyword');
const Topic = require('../models/topic');
const Alias = require('../models/alias');
const Domain = require('../models/domain');
const Area = require('../models/area');
const User = require('../models/user');


//controller for GET add-topic
exports.getAddTopic = (req, res, next) => {
  
  User.findOne({where:{id:req.session.user.id}}).then(user=>{
    return user.getDomains()
  }).then(domains =>   { 
  Keyword.findAll().then((allKeywords) => {
    Alias.findAll().then((allAliases) => {
         Area.findAll({ where: { domainId: domains.map(x=>x['id']) } }).then((allAreas) => {
          res.render('author/add-topic', {
            pageTitle: 'Add Topic',
            path: '/author/add-topic',
            formsCSS: true,
            productCSS: true,
            activeAddTopic: true,
            allAliases: allAliases,
            allKeywords: allKeywords,
            allDomains: domains,
            allAreas: allAreas,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin
          })
        })
      
    });
  })});
}

//controller for POST add-topic
exports.postAddTopic = (req, res, next) => {
  
  const domain = req.body.domain;
  const areaJson = JSON.parse(req.body.area);
  const area = areaJson['id'];

  console.log("area");
  console.log(area);
  const topicId = req.body.topicId;
  const name = req.body.name;
  const contentFile = req.files['contentUpload'][0];
  const rmdFile = ((typeof req.files['rmdUpload']!=='undefined')?req.files['rmdUpload'][0]:null);
  const difficulty = req.body.difficulty;
  const keyword = req.body.keyword;
  const keywords = req.body.keywords;
  const alias = req.body.alias;
  const aliases = req.body.aliases;
  const paragraph = req.body.paragraph;

  Topic.create({
    domain: domain,
    areId: area,
    difficulty: difficulty,
    topicId: topicId,
    name: name,
    teaser: paragraph,
    contentHtml: contentFile.path,
    contentRmd: ((rmdFile)?rmdFile.path:null)
  }).then((newTopic) => {
    newTopic.setUser(req.session.user.id);
    if (keyword) { //checks if keyword input field was used
      Keyword.create({
        value: keyword
      }).then((newKeyword) => {
        newTopic.addKeyword(newKeyword)
      }).catch(err => console.log(err));
    } else {
      Keyword.findAll({where:{
        id: keywords
      }}).then((newKeywords) => {
        newTopic.addKeywords(newKeywords)
      }).catch(err => console.log(err))
    }
    if (alias) { //checks if alias input field was used
      Alias.create({ value: alias }).then((newAlias => {
        newTopic.addAlias(newAlias)
      })).catch(err => console.log(err))
    } else {
      Alias.findAll({where:{ id: aliases }}).then((newAliases) => {
        newTopic.addAliases(newAliases)
      }).catch(err => console.log(err))
    }
    newTopic.setArea(area).then(()=>res.redirect('/author/'));
  });

  
  
};

exports.getTopics = (req, res, next) => {
  
  if (req.session.isAdmin){
    Topic.findAll().then(topics =>{
    res.render('author/topics', {
      topics: topics,
      pageTitle: 'Topics',
      path: '/',
      hasTopics: topics.length > 0,
      activeTopics: true,
      productCSS: true,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      errors: []
    })})} else {
    Topic.findAll({where:{userId:req.session.user.id}}).then(topics =>{
      res.render('topics', {
        topics: topics,
        pageTitle: 'Topics',
        path: '/',
        hasTopics: topics.length > 0,
        activeTopics: true,
        productCSS: true,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        errors: []
      })})}
};

exports.getTopic = (req, res, next) => {

  const topicId = req.params.topicId;

  Topic.findOne({ where: { id: topicId } }).then((topic) => {
    res.render('author/topic', {
      topic: topic,
      pageTitle: 'Topic',
      path: '/topic/'+topicId,
      activeTopics: true,
      productCSS: true,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      errors: []
    })
  });
}
