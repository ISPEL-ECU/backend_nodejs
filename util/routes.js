
const reactRoutes = require('../routes/react');
const path = require('path');



function define(app) {
    // app.use('/author', authorRoutes);
    // app.use('/admin', adminRoutes);
    // app.use('/auth', authenticationRoutes);
    app.use('/react', reactRoutes);
    // app.use('/', userRoutes);
    

  
}


module.exports = {define};