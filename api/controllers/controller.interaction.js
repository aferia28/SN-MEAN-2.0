'use strict'

let path = require('path'),
    fs = require('fs'),
    mongoose_paginate = require('mongoose-pagination'),
    mongoose = require('mongoose'),
    User = require('../models/user'),
    Follow = require('../models/follow');


function save_follow(req, res) {
  let params = req.body;
  let follow = new Follow();
  let followed = params.followed ? params.followed : undefined;

  if (!followed) {
    return res.status(404).send({message: "FAIL: Something wrong: missing params"});
  }

  follow.user = req.user.sub;
  follow.follower = followed;

  follow.save((err, follow_stored) => {
    if (err || !follow_stored) {
      if (err) {
        return res.status(500).send({message: "FAIL: Something wrong"});
      }
      return res.status(404).send({message: "FAIL: Something wrong: follow does not save"});
    }
    return res.status(200).send({follow: follow_stored});
  });
}


function unfollow(req, res) {
  let user_id = req.user.sub;
  let unfollow_id = req.params.id;

  Follow.find({'user': user_id, 'follower': unfollow_id}).remove( err => {
    if (err) {
      return res.status(500).send({message: "FAIL: Something wrong on unfollow action"});
    }

    return res.status(200).send({message: "Unfollow action done"});
  })
}

/**
 * [get_followed that return users you are following]
 * @param  {[type]} req [request]
 * @param  {[type]} res [response]
 * @return {[type]}     []
 */
function get_followed(req, res) {
  let user_id = req.params.id;
  let page = req.params.page ? req.params.page : 1;
  let items_per_page = 4;

  Follow.find({user: user_id})
    .populate({path: 'follower'})
    .paginate(page, items_per_page, (err, follows, total) => {
      if (err || !follows) {
        if (err) {
          return res.status(500)
            .send({message: "FAIL: Something wrong"});
        }
        return res.status(404)
          .send({message: "FAIL: Something wrong: you do not have any follows"});
      }

      return res.status(200).send({
        total: total,
        pages: Math.ceil(total/items_per_page),
        follows: follows
      });
    });
}

/**
 * [get_followers description]
 * @param  {[object]} req [http request]
 * @param  {[object]} res [htpp response]
 * @return {[object]}     [return an object with total results, total pages and an array of followers]
 */
function get_followers(req, res) {
  let user_id = req.params.id; //user that the followers want to see
  let page = req.params.page ? req.params.page : 1;
  let items_per_page = 4;

  /*
  * If want to return the info of followe user, replace "path: 'user'" -> 'user follower'
  * and the query will populate all user fields.
  */
  Follow.find({follower: user_id})
    .populate({path: 'user'})
    .paginate(page, items_per_page, (err, followers, total) => {
      if (err || !followers) {
        if (err) {
          return res.status(500)
            .send({message: "FAIL: Something wrong"});
        }
        return res.status(404)
          .send({message: "FAIL: Something wrong: you do not have any followers"});
      }

      return res.status(200).send({
        total: total,
        pages: Math.ceil(total/items_per_page),
        followers: followers
      });
    });
}

/*
* This function returns follow status ( you follow the user or user follows you ) of user that you are looking for.
* Return
* { following: boolean, followed: boolean }
*/
async function get_user_follow_status(identity_user_id, user_id) {
  let following = await Follow.findOne({
    'user': identity_user_id,
    'follower': user_id
  })
  .then((following) => {
      let _following = following ? true : false;
      return _following;
  })
  .catch((err)=>{
      return handleError(err);
  });

  let followed = await Follow.findOne({
    'user': user_id,
    'follower': identity_user_id
  })
  .then((followed) => {
      let _followed = followed ? true : false;
      return _followed;
  })
  .catch((err) => {
      return handleError(err);
  });

    return {
      following: following,
      followed: followed
    }
}

async function get_user_following_status(identity_user_id) {
  //users that follows the user logged
  let following_ids_arr = await Follow.find(
    {'user': identity_user_id}, 'follower')
    .then((following) => {
      let ids_Arr = [];
      following.forEach(elem => {
        ids_Arr.push((elem.follower).toString());
      });
      return ids_Arr;
    })
    .catch((err) => {
      return handleError(err);
    })

    //users that the user logged follows
    let followed_ids_arr = await Follow.find(
      {'follower': identity_user_id}, 'user')
      .then((followed) => {
        let ids_Arr = [];
        followed.forEach(elem => {
          ids_Arr.push((elem.user).toString());
        });
        return ids_Arr;
      })
      .catch((err) => {
        return handleError(err);
      })

      return {
        following_ids: following_ids_arr,
        followed_ids: followed_ids_arr
      }
}

  module.exports = {
    save_follow,
    unfollow,
    get_followed,
    get_followers,
    get_user_follow_status,
    get_user_following_status
  }
