'use strict'

let express = require('express');
let authController = require('../controllers/controller.auth');
let auth_middleware = require('../middlewares/middleware.auth');

let api = express.Router();

api.post('/register', authController.saveUser);
api.post('/login', authController.login);

module.exports = api;
