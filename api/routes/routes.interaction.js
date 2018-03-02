'use strict'

let express = require('express'),
    interaction_controller = require('../controllers/controller.interaction'),
    auth_middleware = require('../middlewares/middleware.auth');

let api = express.Router();


api.post('/follow', auth_middleware.ensureAuth, interaction_controller.save_follow);
api.delete('/unfollow/:id', auth_middleware.ensureAuth, interaction_controller.unfollow);
api.get('/following/:id/:page?', auth_middleware.ensureAuth, interaction_controller.get_followed)
api.get('/followers/:id/:page?', auth_middleware.ensureAuth, interaction_controller.get_followers)

module.exports = api;
