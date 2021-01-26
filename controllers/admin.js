const Domain = require('../models/domain');
const Area = require('../models/area');
const User = require('../models/user');


const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAddDomain = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
      }
    res.render('admin/add-domain', {
        pageTitle: 'Add Domain',
        path: '/admin/add-domain',
        formsCSS: true,
        productCSS: true,
        activeAddTopic: true,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        errors: null
    })
}

exports.postAddDomain = (req, res, next) => {
    const name = req.body.name;
    const shortName = req.body.shortName;
    Domain.create({
        name: name,
        shortName: shortName
    }).then(() =>{
        res.redirect('/admin/add-area');
    });
}


exports.getAddArea = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
      }
    Domain.findAll().then((domains) =>{
    res.render('admin/add-area', {
        pageTitle: 'Add Area',
        path: '/admin/add-area',
        domains: domains,
        formsCSS: true,
        productCSS: true,
        activeAddTopic: true,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        errors: null
    })})
}

exports.postAddArea = (req, res, next) => {
    const domainId = req.body.domainId;
    const name = req.body.name;
    const shortName = req.body.shortName;
    Area.create({
        name: name,
        shortName: shortName,
        domainId: domainId
    }).then(() =>{
        res.redirect('/admin/add-area');
    })
}

exports.getManageUsers = (req, res, next) => {
    User.findAll().then(users =>{
            res.render('admin/users', {
                pageTitle: 'Users',
                path: '/admin/users',
                activeAddTopic: true,
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
                errors: null,
                users: users
            })
        }).catch(err => console.log(err));
  
}

exports.getUser = (req, res, next) => {
    User.findOne({where:{id:req.params.userId}}).then(user =>{
            Domain.findAll().then(domains =>{
                user.getDomains().then(selectedDomains =>{
           console.log(selectedDomains.map(x => x.id));
            res.render('admin/user', {
                pageTitle: 'User',
                path: '/admin/user'+req.params.userId,
                activeAddTopic: true,
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
                errors: null,
                user: user,
                domains: domains,
                selectedDomains: selectedDomains.map(x => x.id)
            })})})
        }).catch(err => console.log(err));
  
}

exports.postUser = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const admin = ((req.body.admin=='on')?true:false);
    const domainIds = req.body.domainIds;
    
    User.findOne({where:{id:req.params.userId}})
    .then(user => {
        if (password.length>0){
            return bcrypt.hash(password, 12).then(hashedPassword =>{
        user.update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            admin: admin
        }).then(user =>{
            Domain.findAll({where:{id:domainIds}}).then(domains=>{
                user.setDomains(domains).then(()=>{
                    res.redirect('/admin/users');
                })
            })
        })})} else {
            user.update({
                firstName: firstName,
                lastName: lastName,
                email: email,
                admin: admin
            }).then(user =>{
                if (Array.isArray(domainIds)){
                Domain.findAll({where:{id:{[Op.in]:domainIds}}}).then(domains=>{
                    user.setDomains(domains).then(()=>{
                        res.redirect('/admin/users');
                    })
                })
        } else{
            Domain.findOne({where:{id:domainIds}}).then(domains=>{
            user.setDomains(domains).then(()=>{
                res.redirect('/admin/users');
            })
        })

        }
    }).catch(err => console.log(err))};
    })
}

