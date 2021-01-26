const path = require('path');

const express = require('express');

const topicsController = require('../controllers/author');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /author/add-topic => GET
router.get('/add-topic', isAuth, topicsController.getAddTopic);

// /author/add-topic => POST
router.post('/add-topic',  isAuth, topicsController.postAddTopic);

router.get('/', isAuth, topicsController.getTopics);

router.get('/topic/:topicId',  isAuth, topicsController.getTopic);

module.exports = router;