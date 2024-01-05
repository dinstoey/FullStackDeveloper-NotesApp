const jwt = require("jsonwebtoken");

// Middleware to protect route - require JWT token for access
const authenticationMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  //verify the token
  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // if token is verified, get the userID
    req.userId = decoded.userId;
    next();
  });
};

module.exports = authenticationMiddleware;
