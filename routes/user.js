const path = require('path');

const express = require('express');

const topicsController = require('../controllers/topics');

const router = express.Router();

router.get('/topic/:topicId', topicsController.getTopic);

module.exports = router;