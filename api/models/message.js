'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = Schema({
  emmiter: { type: Schema.ObjectId, ref: 'User' },
  receiver: { type: Schema.ObjectId, ref: 'User' },
  text: String,
  create_at: String
})

module.exports = mongoose.model('Message', messageSchema);
