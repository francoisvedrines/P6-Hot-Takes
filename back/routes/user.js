/************************************************************/
/***************** routes user *****************************/
/************************************************************/
const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const email = require ('../middleware/email-validator')
const password = require('../middleware/password-validator')

router.post ('/signup', email, password, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router