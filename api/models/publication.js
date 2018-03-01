'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let publicationSchema = Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  text: String,
  file: String,
  create_at: String
})

module.exports = mongoose.model('Publication', publicationSchema);
