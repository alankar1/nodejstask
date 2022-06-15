const express = require("express");
const app = express();
const User = require("../Model/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
const auth = require("../middleware/auth");
dotEnv.config({ path: "process.env" });

// this api work for register user
app.post("/register", async (req, res) => {
  const { userName, password: PasswordValue } = req.body;
  //console.log(userName + "" + PasswordValue);
  if (!userName || typeof userName !== "string") {
    return res.json({ status: "error", error: "Invalid UserName" });
  }
  if (!PasswordValue || typeof PasswordValue !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  if (PasswordValue.length < 5) {
    return res.json({
      status: "error",
      error: "Password to small should be atleast 6 character ",
    });
  }
  const password = await bcryptjs.hash(PasswordValue, 10);
  try {
    const response = User.create({
      UserName: userName,
      Password: password,
    });
    response
      .then((result) => {
        //console.log("User Create Successfully:", result);
        return res.json(result);
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.json({
            status: "Error",
            error: "UserName already in use",
          });
        }
      });
  } catch (error) {
    console.log(error.code);
    return res.json({ status: "Error", error: error.MongoServerError });

    //throw JSON.stringify(error.MongoServerError);
  }
});

// this api for login
const key = process.env.JWT_SECRET_KEY;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // this is check for username available or not in db
  const user = await User.findOne({ UserName: username }).lean();
  if (!user) {
    return res.json({
      status: "error",
      error: "Invalid username and password",
    });
  }
  // this is for password check
  const checkPassword = await bcryptjs.compare(password, await user.Password);
  if (checkPassword) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.UserName,
      },
      key,
      {
        expiresIn: "30s",
      }
    );
    return res.json({ status: "ok", data: token });
  } else {
    res.json({ status: "error", error: "Check the password again" });
  }
});

//Get all user
app.get("/getAllUser", verifyToken, async (req, res) => {
  try {
    const allrecords = await User.find();
    return res.json(allrecords);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: error });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      //console.log(user);
      next();
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

module.exports = app;
