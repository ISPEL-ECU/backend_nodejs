const authorRoutes = require('../routes/author');
const userRoutes = require('../routes/user');
const adminRoutes = require('../routes/admin');
const authenticationRoutes = require('../routes/auth');
const path = require('path');



function define(app) {
    app.use('/author', authorRoutes);
    app.use('/admin', adminRoutes);
    app.use('/auth', authenticationRoutes);
    app.use('/', userRoutes);

  
}


module.exports = {define};