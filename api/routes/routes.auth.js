'use strict'

let express = require('express');
let authController = require('../controllers/controller.auth');
let auth_middleware = require('../middlewares/middleware.auth');

let api = express.Router();

api.post('/register', authController.register);
api.post('/login', authController.login);

api.get('/user/:id', auth_middleware.ensureAuth, authController.get_user);
api.get('/users/:page?', auth_middleware.ensureAuth, authController.get_user_list);

module.exports = api;
