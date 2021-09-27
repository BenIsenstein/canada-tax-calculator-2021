// Import environment variables
require("dotenv").config()

// Import other packages
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')

// Define express app and top-level API router 
const app = express()
const apiRouter = require('./routes/apiRouter')

// Initialize passport strategy
require('./passport-config')

// passport middleware
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

// Configure Express App
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
app.use('/api', apiRouter)

// serve the react application
app.use(express.static('../client/build'))

// catch any non-specific urls
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/build', 'index.html')))

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send('error')
})

module.exports = app