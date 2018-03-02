'use strict'

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//define routes
let user_routes = require('./routes/routes.auth')
let interaction_routes = require('./routes/routes.interaction')

//middlewares
//to parser all request data to json
app.use(bodyParser.urlencoded({limit: '50mb', extended:false}));
app.use(bodyParser.json({limit: '50mb'}));

//cors

//routes
/* Use routes on routes/routes.auth like api routes:
  ie: route "/home" on routes.auth will be used as "/api/home"
*/
app.use('/api', user_routes);
app.use('/api', interaction_routes);

app.get('/', (req, res) => {
  res.status(200).send({
    message: "Test route"
  })
})

module.exports = app;
