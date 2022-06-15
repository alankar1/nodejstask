const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const routes = require("./route/routes");

app.use(bodyParser.json());
dotEnv.config({ path: "process.env" });

//Set mongoose db connection
mongoose
  .connect("mongodb://localhost:27017/TestMongoo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  .then(() => {
    console.log("DBConnect");
  })
  .catch((error) => {
    console.log("errorMessage:", error.message);
  });

// this is for port number
const port = process.env.PORT || 3000;
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
// this is for all api routes
app.use("/api", routes);
app.use(express.urlencoded({ extended: true }));

// this is for server
app.listen(port, () => {
  console.log("Server Running at http://localhost:", port);
});
