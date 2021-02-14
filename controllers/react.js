const path = require('path');

const Topic = require('../models/topic');
const Domain = require('../models/domain');
const Area = require('../models/area');
const { Op } = require("sequelize");


exports.getTopics = (req, res, next) => {
    if (req.query.areaId !== '%') {
        Topic.findAll({ where: { areaId: req.query.areaId } }).then(topics => {
            res.send(topics);
        }).catch(err => console.log(err));
    }

    else {

        Topic.findAll().then(topics => {
            res.send(topics);
        }).catch(err => console.log(err));
    }
}

exports.getSelectedTopics = (req, res, next) => {
    Topic.findAll({ where: { id: req.query.id } }).then(topics => {
        res.send(topics);
    }).catch(err => console.log(err));
}

exports.getTopicsSearch = (req, res, next) => {

    Topic.findAll({
        where: {
            name: {
                [Op.like]: '%' + req.query.name + '%'
            }
        }
    }).then(topics => {
        res.send(topics);
    }).catch(err => console.log(err));
}

exports.getSelectedTopics = (req, res, next) => {
    Topic.findAll({ where: { id: req.query.id } }).then(topics => {
        res.send(topics);
    }).catch(err => console.log(err));
}

exports.getDomains = (req, res, next) => {
    Domain.findAll().then(domains => {
        res.send(domains);
    }).catch(err => console.log(err));
}

exports.getAreas = (req, res, next) => {
    Area.findAll({ where: { domainId: req.query.domainId } }).then(areas => {
        res.send(areas);
    }).catch(err => console.log(err));
}

exports.getSelectedContent = (req, res, next) => {
    console.log(req.query.id);
    if (req.query.id && req.query.id !== '') {
        Topic.findOne({ where: { id: ((req.query.id)) } }).then(topic => {
            res.send(topic.contentHtml);
        }).catch(err => console.log(err));
    }
    else {
        res.send('');
    }
}