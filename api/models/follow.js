'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let followsSchema = Schema({
  user: {type: Schema.ObjectId, ref: 'User'}, // User that follow
  follower: {type: Schema.ObjectId, ref: 'User'} // User to be followed
})

module.exports = mongoose.model('Follow', followsSchema);
