const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
  },
  { collection: "LoginEntry" }
);

const model = mongoose.model("UserSchema", UserSchema);
module.exports = model;
