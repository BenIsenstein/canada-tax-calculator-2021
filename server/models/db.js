require("dotenv").config()

// Establish MongoDB connection
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', () => console.log('MongoDB is now connected:', process.env.MONGODB_URL))
db.on('error', (err) => console.error('MongoDB connection error!', err))

// General db functions
const closeDb = async () => await db.close({ force: true })

const searchByFragment = async (Model, attribute, fragment) => await Model.find({ [attribute]: new RegExp(`.*${fragment}.*`, "i") })
  

module.exports = {
  closeDb,
  searchByFragment   
}