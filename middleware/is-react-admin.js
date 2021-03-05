const jwt = require("jsonwebtoken");
const User = require('../models/user');


module.exports = (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    const error = new Error('Something went wrong');
    error.statusCode = 500;
    console.log(error);
    throw error;
  }
 
  User.findOne({
    where: {id: userId}
  })
  .then((user)=>{
    return user.getRole()})
  .then((role)=>{
    if (!role){
      const error = new Error('You are not authorized');
      console.log(error);
      error.statusCode = 401;
      throw error;
    }
    if (role.roleCode!='1') {
      const error = new Error('You are not authorized');
      console.log(error);
      error.statusCode = 401;
      throw error;
    }
   
    next();

  })
  
};
