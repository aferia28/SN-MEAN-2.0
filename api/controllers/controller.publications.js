'use strict'

const valid_image_ext = ["jpg", "png", "jpeg", "gif"];

let path = require('path'),
    fs = require('fs'),
    moment = require('moment'),
    mongoose_paginate = require('mongoose-pagination'),
    Publication = require('../models/publication'),
    User = require('../models/user'),
    Follow = require('../models/follow');


function save_publication(req, res) {
  let params = req.body;

  if (!params.text) {
    return res.status(404)
      .send({message: "FAIL: Something wrong: you do not have any follows"});
  }

  let publi = new Publication();
  publi.user = req.user.sub;
  publi.text = params.text;
  publi.file = null; //TODO
  publi.create_at = moment().unix();

  publi.save((err, publiStored) => {
    if (err) return res.status(500).send({message: "Some error saving publication: ", error: err});
    if (publiStored){
      return res.status(200).send({
        message: "Publication posted succesfull.",
        publication: publiStored});
    }else{
      return res.status(400).send({message: "Publication has not been posted."});
    }
  })
}

function update_publication_image(req, res) {
  let publication_id = req.params.id;

  Publication.findOne({
    'user': req.user.sub,
    '_id': publication_id}, (err, publication) => {
      if (err) {
        return res.status(500).send({message: "FAIL.", error: err});
      }

      if (!publication) {
        return res.status(404).send({message: "FAIL. There are no publications with ID "+publication_id + " or you do not have permission to edit it."});
      }

      if (req.files) {
        let file_path = req.files.image.path,
            file_split = file_path.split('\\'),
            file_name = file_split[2],
            file_ext = file_name.split('\.')[1];

        if (valid_image_ext.includes(file_ext)) {

          Publication.findByIdAndUpdate(publication_id, {file: file_name}, {new: true}, (err, updated_publication) => {
            if(!updated_publication) return res.status(404).send({message: "FAIL: update failed"});

            return res.status(200).send({
              publication: updated_publication
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
  })
}

function get_publication(req, res) {
  let publication_id = req.params.id;

  Publication.findById(publication_id, (err, publication) => {
    if (err) return res.status(500).send({message: "Some error getting publication: ", error: err});
    if (publication){
      return res.status(200).send({
        publication: publication
      });
    }else{
      return res.status(400).send({message: "There are no publications with this ID."});
    }
  })
}

function delete_publication(req, res) {
  let publication_id = req.params.id;

  Publication.findOneAndRemove({'user': req.user.sub, '_id': publication_id}, (err, publicationRemoved) => {
    if (err) return res.status(500).send({message: "Error deleting publication: ", error: err});
    if (!publicationRemoved) {
      return res.status(404).send({message: "The publication does not exists, or you don't have permission to delete it."});
    }
    return res.status(200).send({message: "Publication deleted succesfully."});
  })
}

function get_timeline(req, res) {
  let user_id = req.params.id ? req.params.id : false;

  if (user_id) {
    //timeline user
    Publication.find({'user': user_id}).sort('-created_at').exec((err, publications) => {
      if (err) return res.status(500).send({message: "FAIL: Error getting user timeline", error: err});
      if (publications){
        return res.status(200).send({
          publications: publications
        });
      }else{
        return res.status(400).send({message: "This user does not has any publications."});
      }
    })
  }else{
    //general timeline for users that are followed for the logged user

    Follow.find({'user': req.user.sub}).populate('follower')
    .exec((err, follows) => {
      if (err) return res.status(500).send({message: "FAIL: Error getting followed users", error: err});
      if (follows){
        let followed_users_arr = [];
        follows.forEach(elem => {
          followed_users_arr.push(elem.follower._id);
        });
        Publication.find({user: {'$in': followed_users_arr}}).sort('-created_at').exec((err, publications) => {
          if (err) return res.status(500).send({message: "FAIL: Error getting user timeline", error: err});
          if (publications){
            return res.status(200).send({
              publications: publications
            });
          }else{
            return res.status(400).send({message: "Does not are any publications."});
          }
        })

      }else{
        return res.status(400).send({message: "This user does not has any followed users."});
      }
    })
  }
}

module.exports = {
  save_publication,
  get_timeline,
  get_publication,
  delete_publication,
  update_publication_image
}
