const path = require('path');

const express = require('express');

const reactController = require('../controllers/react');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/get-topics-search', reactController.getTopicsSearch);
router.get('/get-topics', reactController.getTopics);
router.get('/get-selected-topics', reactController.getSelectedTopics);
router.get('/get-domains', reactController.getDomains);
router.get('/get-areas', reactController.getAreas);
router.get('/get-content', reactController.getSelectedContent);

module.exports = router;