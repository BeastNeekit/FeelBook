const mongoose = require("mongoose");
//Schema

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
  },
  profilePicture: String,
});
const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
//

