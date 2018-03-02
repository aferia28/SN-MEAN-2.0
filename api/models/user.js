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
        if (!docs.length){
            next();
        }else{
            console.error('FAIL: User exists: ', self.email);
            next(new Error("User exists!"));
        }
    });
});

let User = mongoose.model('User', userSchema);
module.exports = User;
