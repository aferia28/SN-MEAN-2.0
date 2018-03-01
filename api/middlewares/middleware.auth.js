'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let conf_const = require('../settings/configure');

let secret_key_token = 'secret_key_token_s0ci4l_n3twork';

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "Bad request. No authentication header."
    })
  }

  let token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    let payload = jwt.decode(token, secret_key_token);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: "Token has expired."
      })
    }
  } catch (err) {
    return res.status(404).send({
      message: "INVALID Token."
    })
  }

  req.user = payload;
  next();
}
