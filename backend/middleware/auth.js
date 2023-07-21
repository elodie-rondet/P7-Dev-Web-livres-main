const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).send("Unauthorized");
  const token = authorization.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) return res.status(401).send("Unauthorized");
    req.body.userIdFromToken = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("Unauthorized");
  }
}

module.exports = { checkToken };


/*const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       if (!decodedToken) return res.status(401).send("Unauthorized");
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
    res.status(401).send("Unauthorized");
   }
};*/

