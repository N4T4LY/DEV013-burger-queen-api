const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  console.log("authorization",authorization);
  
  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.log("TOKEN",token);
      console.log("secret",secret);
      return next(403);
    }else{
      console.log("decodedToken",decodedToken);
      req.isAdmin=decodedToken.role==='admin';
      console.log("isadmin: ",req.isAdmin);
      req.uid=decodedToken._id;
      next();
    }

    // TODO: Verify user identity using `decodeToken.uid`

  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: Decide based on the request information whether the user is authenticated
  !!req.uid
  
);

module.exports.isAdmin = (req) => (
  // TODO: Decide based on the request information whether the user is an admin
 req.isAdmin
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);