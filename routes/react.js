const path = require('path');

const express = require('express');

const reactController = require('../controllers/react');

const isAuth = require('../middleware/is-react-auth');
const isAdmin = require('../middleware/is-react-admin');


const router = express.Router();

router.get('/get-topics-search',  reactController.getTopicsSearch);
router.get('/get-topics', reactController.getTopics);
router.get('/get-selected-topics', isAuth, reactController.getSelectedTopics);
router.get('/get-domains', reactController.getDomains);
router.get('/get-areas', reactController.getAreas);
router.get('/get-content', reactController.getSelectedContent);
router.post('/login', reactController.login);
router.post('/save-course', isAuth, reactController.postSaveCourse);
router.get('/get-courses', reactController.getCourses);
router.get('/get-course', reactController.getCourse);
router.get('/get-aliases', isAuth, reactController.getAliases);
router.get('/get-keywords', isAuth, reactController.getKeywords);
router.post('/save-topic', isAuth, reactController.postSaveTopic);
router.get('/users', isAuth, isAdmin, reactController.getUsers);
router.get('/get-roles', isAuth, isAdmin, reactController.getRoles);
router.post('/save-user', isAuth, isAdmin, reactController.postUser);
router.post('/create-user', isAuth, isAdmin, reactController.postAddUser);
router.get('/get-user', isAuth,  reactController.getUser);
router.post('/save-account', isAuth,  reactController.postAccount);
router.get('/get-questions', reactController.getQuestions);
router.get('/check-results', reactController.getCorrectAnswer);
router.get('/quiz-exist', reactController.getQuizExistForTopic);
//router.get('/get-user-role', isAuth, isAdmin, reactController.getUserRole);

module.exports = router;