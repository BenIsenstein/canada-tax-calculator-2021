const LocalStrategy = require("passport-local").Strategy
const { User, findUserById } = require('../models/User')
const Auth = require('../models/Auth')
const passport = require('passport')
const bcrypt = require('bcrypt')

const verifyUser = async (username, password, done) => {
    console.log("passport-cofig verifying user...")
    
    try {
        const authCheck = await Auth.findOne({ email: username })

        if (!authCheck) {
            return done(null, false, { message: 'There is no user with that email.' })
        }
        else {  
            if (await bcrypt.compare(password, authCheck.password)) {
                console.log(`Password match for user ${authCheck.email}`)
                // grab the user profile linked to the authenticated email and send it back
                return done(null, await User.findOne( { email: username } ))
            }
            else {
                return done(null, false, { message: 'Password incorrect.' })      
            }
        }
    } 
    catch(e) {
        return done(e)
    }
}

const deserialize = async (id, done) => {
    const user = await findUserById(id)
    return done(null, user)
}

passport.use(new LocalStrategy(verifyUser))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => await deserialize(id, done))

