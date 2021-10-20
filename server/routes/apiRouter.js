const router = require('express').Router()

const userRouter = require('./user')
const authRouter = require('./auth')
const sendEmailRouter = require('./sendEmail')

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/sendEmail', sendEmailRouter)

module.exports = router