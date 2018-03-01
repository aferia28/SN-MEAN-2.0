'use strict'

let express = require('express');
let UserController = require('../controllers/controller.user');

let api = express.Router();

api.post('/register', UserController.saveUser);

module.exports = api;
