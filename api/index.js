'use strict'

//import mongoose
let mongoose = require('mongoose');
let app = require('./app');
let port = 3800;

//bbdd connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SNmean', {userMongoClient:true})
  .then(() => {
    console.log("\n\n### Connection with BBDD succesfull. ###");

    //create server
    app.listen(port, () => {
      console.log("\n### Server created succesfull ###");
    })
  })
  .catch(err => {
    console.log(err);
  })
