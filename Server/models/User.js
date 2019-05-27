const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  githubId: String,
  username: String
});

mongoose.model('users', userSchema)