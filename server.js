var express = require('express');
var connect = require('connect');

var corsOptions = {
  origin: 'http://localhost'
};

var app = express.createServer();


app.configure(function() {
    
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(connect.static('webapp'));
});

app.listen(8000);

console.log('Server running at 8000 port');