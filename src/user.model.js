const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {type: String, unique: true, required: true},
  email: String,
  password: {type: String, required: true},
});

const removePassword = (doc, ret, options) => {
  delete ret.password;
  return ret;
};

userSchema.set('toJSON', {virtuals: true, versionKey: false, transform: removePassword});

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel
