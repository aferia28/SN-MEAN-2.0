'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let conf_const = require('../settings/configure');

let secret_key_token = 'secret_key_token_s0ci4l_n3twork'

exports.createToken = (user) => {
  let payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  }

  return jwt.encode(payload, secret_key_token);
};
