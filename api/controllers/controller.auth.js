'user strict'
const required_data = ["name", "surname", "email", "password"];
const valid_image_ext = ["jpg", "png", "jpeg", "gif"];

let bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
let Follow = require('../models/follow');
let interaction_controller = require('../controllers/controller.interaction');
let jwt = require('../services/jwt');
let mongoose_paginate = require('mongoose-pagination');
let fs = require('fs');
let path = require('path');


function register (req, res) {
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
        return res.status(200).send({
          message: "User registered succesfull.",
          user: userStored});
      }else{
        return res.status(400).send({message: "User has not registered."});
      }
    })
  }else{
    return res.status(200).send({
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
          return res.status(404).send({message: "Wrong passwordfor ", email});
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


function update_user(req, res) {
  let user_id = req.params.id;
  let update_data = req.body;

  if (user_id != req.user.sub) {
    return res.status(500).send({message: "FAIL: You do not have permission to update this user."});
  }

  User.findByIdAndUpdate(user_id, update_data, {new:true},
    (err, updated_user) => {
      if (err) return res.status(500).send({message: "FAIL: Connection failed"});
      if(!update_user) return res.status(404).send({message: "FAIL: update failed"});

      return res.status(200).send({
        user: updated_user
      })
    });
}


function update_avatar(req, res) {
  let user_id = req.params.id;

  if (user_id != req.user.sub) {
    return res.status(500).send({message: "FAIL: You do not have permission to update this user."});
  }

  if (req.files) {
    let file_path = req.files.image.path,
        file_split = file_path.split('\\'),
        file_name = file_split[2],
        file_ext = file_name.split('\.')[1];

    if (valid_image_ext.includes(file_ext)) {
      User.findByIdAndUpdate(user_id, {image: file_name}, {new: true}, (err, updated_user) => {
        if (err) return res.status(500).send({message: "FAIL: Connection failed"});
        if(!update_user) return res.status(404).send({message: "FAIL: update failed"});

        return res.status(200).send({
          user: updated_user
        })
      })
    }else{
      fs.unlink(file_path, (err) => {
        return res.status(200).send({message: "FAIL: Invalid extension"});
      });
    }
  }else{
    return res.status(200).send({message: "FAIL: No files uploaded."});
  }
}


function get_image_file(req, res) {
  let image_file = req.params.imageFile;
  let path_file = './uploads/users/'+image_file;

  fs.exists(path_file, (exists) => {
    if (!exists) {
      res.status(200).send({message: "FAIL: No image found"})
    }
    res.sendFile(path.resolve(path_file));
  })
}


function get_user(req, res) {
  let user_id = req.params.id;

  User.findOne({'_id': user_id}, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Request error"
      })
    }

    if (!user) {
      return res.status(404).send({
        message: "User does not exist"
      })
    }

    interaction_controller.get_user_follow_status(req.user.sub, user_id)
      .then((value) => {
        return res.status(200).send({
          user,
          following: value.following,
          followed: value.followed
        });
      });
  }).select('-password')
}

function get_user_list(req, res) {
  let identity_user_id = req.user.sub;
  let page = 1;
  let items_per_page = 5;

  if (req.params.page) {
    page = req.params.page;
  }

  User.find().sort('_id').paginate(page, items_per_page, (err, users, total) => {
    if (err) {
      return res.status(500).send({
        message: "Request error"
      })
    }

    if (!users) {
      return res.status(404).send({
        message: "Does not have user avaiable"
      })
    }

    return res.status(200).send({
      users,
      total,
      pages: Math.ceil(total/items_per_page)
    });
  });
}


 module.exports = {
   register,
   login,
   get_user,
   get_user_list,
   update_user,
   update_avatar,
   get_image_file
 }
