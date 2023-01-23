const express = require('express')
const router = express.Router()
//controller
const userController = require('./controllers/userController');
//auth
const { body } = require('express-validator');
const checkToken = require('./middleware/checkToken');
const checkLogin = require('./middleware/checkLogin');


//User auth
router.get('/user/list', userController.list)
router.get('/user/list', userController.list)
router.post('/register', body('username').notEmpty(), body('password').notEmpty(), userController.create)
router.post('/login', body('username').notEmpty(), body('password').notEmpty(), userController.login);
router.get('/login/profile', checkToken, userController.getProfile);


module.exports = router