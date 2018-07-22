var express = require('express');
var routes = require('./routes');
var multer = require('multer');
var pug = require('pug');

var app = express();
var port=process.env.PORT || 3000;

app.use('/', routes);
app.listen(port, ()=> {
    console.log('Example app is listening on port '+ port);
});