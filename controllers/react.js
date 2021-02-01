const path = require('path');

const Topic = require('../models/topic');
const Domain = require('../models/domain');
const Area = require('../models/area');



exports.getTopics = (req, res, next) =>{
    Topic.findAll({where:{areaId:req.query.areaId}}).then(topics => {
        res.send(topics);
    }).catch(err =>console.log(err));
}

exports.getSelectedTopics = (req, res, next) =>{
    Topic.findAll({where:{id:req.query.id}}).then(topics => {
        res.send(topics);
    }).catch(err =>console.log(err));
}

exports.getDomains = (req, res, next) =>{
    Domain.findAll().then(domains => {
        res.send(domains);
    }).catch(err =>console.log(err));
}

exports.getAreas = (req, res, next) =>{
    Area.findAll({where:{domainId:req.query.domainId}}).then(areas => {
        res.send(areas);
    }).catch(err =>console.log(err));
}

exports.getSelectedContent = (req, res, next) =>{
    if (req.query.id!==''){
    Topic.findOne({where:{id:((req.query.id))}}).then(topic => {
        res.send(topic.contentHtml);
    }).catch(err =>console.log(err));} 
    else {
        res.send('');
    }
}