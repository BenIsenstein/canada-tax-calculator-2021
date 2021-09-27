require('dotenv').config()
const express = require("express")
const passport = require("passport")
const router = express.Router()
const { User, findUserById } = require('../models/User')
const Auth = require("../models/Auth")


// ----------------------------------- SIGNUP ---------------------------------

router.post("/signup", async (req, res) => {
  let { password, ...newUser } = req.body

  try {
    let savedUser = await new User(newUser).save()
    console.log('user to save: ', savedUser)
    res.json({ success: true, userId: savedUser._id })
  } 
  catch (err) {
    console.log("error saving User document: ", err)
    if (err.code === 11000) return res.sendStatus(409)     
    res.sendStatus(500)
  }
})

// ----------------------------------- LOGIN -----------------------------------

router.post("/login",
  // check if someone is already logged in
  (req, res, next) => {
    // if someone is already logged in, send back {isAlreadyLoggedIn: true}
    if (req.isAuthenticated()) {
      res.json({ isAlreadyLoggedIn: true })
    } 
    // move to authentication middleware if no one is logged in
    else {
      console.log("about to log in")
      next() 
    }
  },
  // authentication middleware. sends a status code 401 if auth fails
  passport.authenticate("local"),
  // if authentication passes, the next function has access to req.user
  (req, res) => res.json(req.user)
)

// ----------------------------------- LOGOUT -----------------------------------

router.get("/logout", 
  function (req, res) {
    let username = req.user?.firstName || 'nobody'
    let logoutResult = undefined
    let isLoggedOutNow = undefined

    console.log("is someone currently logged in? ", req.isAuthenticated())

    // logout if someone was logged in, log to console if nobody was logged in
    if (req.isAuthenticated()) {
      req.logOut() 
    }
    else {
      console.log("/user/logout was fetched, but no one was logged in")
    }

    // set the value of logoutResult to be logged
    if (req.isAuthenticated()) logoutResult = `user ${username} is logged in still :(`
    
    else logoutResult = `${username} is logged out!`
      
    // log the message
    console.log("logout result: ", logoutResult)

    // send response with boolean of logout success
    isLoggedOutNow = !req.isAuthenticated()
    res.json({isLoggedOutNow})
  }
)

// ------------------------------------ UPDATE USER---------------------------------

// Update a user by id
router.put('/update/:id', 
  async (req, res) => {
    try {
      // let originalUser = await User.findOne({ _id: req.params.id })
      // for (let key in req.body) originalUser[key] = req.body[key]
      // await originalUser.save()
      console.log('user/update req.body: ', req.body)
      await User.findByIdAndUpdate(req.params.id, req.body)

      res.json({ success: true })
    }
    catch(err) {
      console.log(err)
      if (err.code === 11000) {
        res.status(409).send('User ' + userToUpdate.name + ' already exists');      
      }
      else {
        res.status(500).json({ success: false })
      }
    }
  }
)


// Update a user's FILTER PREFERENCE SETTINGS by id
router.put('/update/settings/filter/:id', 
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, {$set: {'settings.filterPrefs': req.body.settings.filterPrefs}})
      res.json({ success: true })
    }
    catch(err) {
      console.log(err)
      if (err.code === 11000) {
        res.status(409).send('User ' + userToUpdate.name + ' already exists');      
      }
      else {
        res.status(500).json({ success: false })
      }
    }
  }
)

// Update a user's NOTIFICATION PREFERENCE SETTINGS by id
router.put('/update/settings/notifications/:id', 
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, {$set: {'settings.notificationPrefs': req.body.settings.notificationPrefs}})
      res.json({ success: true })
    }
    catch(err) {
      console.log(err)
      if (err.code === 11000) {
        res.status(409).send('User ' + userToUpdate.name + ' already exists');      
      }
      else {
        res.status(500).json({ success: false })
      }
    }
  }
)

// ----------------------------------- GET LOGGED IN USER -----------------------------------

router.get("/getloggedinuser", (req, res) => {
  console.log('getloggedinuser - req.user: ', req.user)
  res.json(req.user || { no_user: true })
})

// ----------------------------------- GET USER INFO by ID -----------------------------------

router.get('/get/:id', async (req, res) => {
  try { res.json(await findUserById(req.params.id)) }

  catch(err) {console.log('ERROR get Calendar Entry by ID:', err)}
})

module.exports = router
