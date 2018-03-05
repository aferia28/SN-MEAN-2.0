'use strict'

let express = require('express'),
    publication_controller = require('../controllers/controller.publications'),
    auth_middleware = require('../middlewares/middleware.auth'),
    multipart = require('connect-multiparty'),
    upload_middleware = multipart({uploadDir: './uploads/publications'});

let api = express.Router();

api.post('/save-post', auth_middleware.ensureAuth, publication_controller.save_publication);
api.put('/update-post-image/:id', [auth_middleware.ensureAuth, upload_middleware], publication_controller.update_publication_image);

api.get('/timeline/:id?', auth_middleware.ensureAuth, publication_controller.get_timeline);
api.get('/post/:id', auth_middleware.ensureAuth, publication_controller.get_publication);

api.delete('/post/:id', auth_middleware.ensureAuth, publication_controller.delete_publication);

module.exports = api;
