const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    isAdmin: false,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: [],
    errors: null
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    isAdmin: false,
    errors: null,
    oldInput: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errors: errors.array(),
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array(),
      isAdmin: false,
      isAuthenticated: false
    });
  }
  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
       return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.isAdmin = user.admin;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/author/');
            });
          }
          res.redirect('/auth/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/auth/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      isAdmin: false,
      errors: errors.array(),
      oldInput: { firstName: firstName, lastName: lastName, email: email, password: password, confirmPassword: confirmPassword }
    });
  }

  return bcrypt.hash(password, 12).then(hashedPassword => {
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
    });
    return user.save();
  }).then(result => {
    res.redirect('/auth/login');
  })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    return res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      oldInput: {
        email: '',
        password: ''
      },
      errors: null,
      validationErrors: [],
      isAdmin: false,
      isAuthenticated: false
    });
  });
};
