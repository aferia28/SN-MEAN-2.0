'user strict'
const required_data = ["name", "surname", "email", "password"];

let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
let jwt = require('../services/jwt');

function saveUser (req, res) {
  let params = req.body;
  let user = new User();

  let done = required_data.every((value, idx, arr) => {
    return value in params;
  })

  if (done) {
    for (let data of required_data) {
      if (data=='password') {
          bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;
        });
      }else{
        user[data] = params[data];
      }
    }

    //Optional fields
    user.role = 'ROLE_USER';
    user.image = null;

    user.save((err, userStored) => {
      if (err) return res.status(400).send({message: "Some error saving user: ", error: err});
      if (userStored){
        res.status(200).send({
          message: "User registered succesfull.",
          user: userStored});
      }else{
        res.status(400).send({message: "User has not registered."});
      }
    })
  }else{
    res.status(200).send({
      message: "Some required fields are missing"
    })
  }
}

function login(req, res) {
  let params = req.body;

  let email = params.email;
  let pass = params.password

  User.findOne({email: email}, (err, user) => {
    if (err) return res.status(500).send({message: "FAIL: Connection failed"});

    if (user) {
      bcrypt.compare(pass, user.password, (err, check) => {
        if (!check) {
          return res.status(404).send({message: "Contraseña incorrecta para ", email});
        }

        if (params.token) {
          return res.status(200).send({
            token: jwt.createToken(user)
          })
        }

        user.password = undefined;
        return res.status(200).send({user: user, token: jwt.createToken(user)});
      })
    }else{
      return res.status(404).send({message: "No existe usuario ", email});
    }
  })
}


 module.exports = {
   saveUser,
   login
 }
