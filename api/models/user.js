'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema

let userSchema = Schema({
  name: String,
  surname: String,
  nick: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: String,
  image: String
});

/*
* User model Validators
*/
userSchema.pre('save', function (next) {
  var self = this;
  User.find({ $or: [
      {email: self.email.toLowerCase()},
      {surname: self.surname.toLowerCase()}
    ]}, (err, docs) => {
        if (docs.length){
          let error = new Error("FAIL: User exists: " +  self.email);
          error.text = "FAIL: " + self.email + " already exist. Try with another email.";
          next(error);
        }else{
          next();
        }
    });
});

let User = mongoose.model('User', userSchema);
module.exports = User;
