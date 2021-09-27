require('./db')
const mongoose = require('mongoose');

// User model and functions

const userSchema = new mongoose.Schema({
  firstName: String, 
  lastName: String,
  userType: String,
  email: { type: String, unique: true, required: true },
  settings: Object,
  dateSignedUp: Date,
})
  
userSchema.methods.validPassword = function (pwd) {
  return this.password === pwd
}

const User = mongoose.model("User", userSchema)

const findUserByName = async (name) => {
  let result = await User.findOne({ username: name })
  return result
}

const findUserById = async (id) => {
  let result = await User.findOne({ _id: id })
  return result
}

const addUser = async (newUser) => {
  let result = await newUser.save()
  return result.username + " succesfully added to database!"
}

module.exports = {
    User,
    findUserById,
    findUserByName,
    addUser
}
  