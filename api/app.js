'use strict'

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//define routes
let user_routes = require('./routes/routes.user')

//middlewares
//to parser all request data to json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//routes
/* Use routes on routes/routes.user like api routes:
  ie: route "/home" on routes.user will be used as "/api/home"
*/
app.use('/api', user_routes);

app.get('/', (req, res) => {
  res.status(200).send({
    message: "Test route"
  })
})

module.exports = app;
