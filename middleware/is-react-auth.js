const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error('You are not authorized');
    error.statusCode = 401;
    throw error;
  }
  const token = req.get("Authorization").split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "mysecretforecu");
  } catch (err) {
    err.statusCode = 500;

    throw err;
  }
  if (!decodedToken) {
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  req.authLevel = decodedToken.roleCode;
  next();
};
