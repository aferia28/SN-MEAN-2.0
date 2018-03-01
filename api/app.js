'use strict'

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//define routes

//middlewares
//to parser all request data to json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//routes
app.get('/', (req, res) => {
  res.status(200).send({
    message: "Test route"
  })
})

module.exports = app;
