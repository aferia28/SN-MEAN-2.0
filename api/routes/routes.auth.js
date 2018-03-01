'use strict'

let express = require('express');
let authController = require('../controllers/controller.auth');
let auth_middleware = require('../middlewares/middleware.auth');
let multipart = require('connect-multiparty');
let upload_middleware = multipart({uploadDir: './uploads/users'})

let api = express.Router();

api.post('/register', authController.register);
api.post('/login', authController.login);

api.get('/user/:id', auth_middleware.ensureAuth, authController.get_user);
api.get('/users/:page?', auth_middleware.ensureAuth, authController.get_user_list);
api.put('/update-user/:id', auth_middleware.ensureAuth, authController.update_user);

api.post('/update-avatar/:id', [auth_middleware.ensureAuth, upload_middleware], authController.update_avatar)

module.exports = api;
