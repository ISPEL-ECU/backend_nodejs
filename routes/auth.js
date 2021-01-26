const express = require('express');

const User = require('../models/user');

const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
   
], authController.postLogin);




router.post('/signup', [
    check('email').isEmail().withMessage('Please enter valid email').custom((value, {req})=>{
        return User.findOne({ where: { email: value } }).then(userDoc => {
            if (userDoc) {
              return Promise.reject('User with such email already exist');
            }
            return true;
    })}),
    check('firstName').isAlpha().withMessage('Please enter correct first name'),
    check('lastName').isAlpha().withMessage('Please enter correct last name'),
    body('password').isLength({min:6}).withMessage('The length of the password should be at least 6 symbols'),
    body('confirmPassword').custom((value, {req}) =>{
        if (value !== req.body.password) {
            throw new Error('Passwords do not match!');
        }
        return true;
    })
], authController.postSignup);

router.get('/logout', authController.postLogout);

module.exports = router;