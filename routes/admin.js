const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// /author/add-topic => GET
router.get('/add-domain', isAuth, isAdmin, adminController.getAddDomain);
router.post('/add-domain', adminController.postAddDomain);

router.get('/add-area', isAuth, isAdmin, adminController.getAddArea);
router.post('/add-area', adminController.postAddArea);

router.get('/users', isAuth, isAdmin, adminController.getManageUsers);

router.get('/user/:userId', isAuth, isAdmin, adminController.getUser);
router.post('/user/:userId', isAuth, isAdmin, adminController.postUser);


module.exports = router;