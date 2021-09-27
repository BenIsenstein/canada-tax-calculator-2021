require('./db')
const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  userId: String,
  dateLastModified: Date,
  confirmCode: String,
  confirmed: Boolean

})

module.exports = mongoose.model('Auth', authSchema);