const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "process.env" });

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split("")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

module.exports = verifyToken;
