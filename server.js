var express = require('express');
var sockjs  = require('sockjs');
var http = require('http');
var _ = require('lodash');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};

var sockets = {};
var socketCounter = 0;

var sockjs_server = sockjs.createServer(sockjs_opts);
sockjs_server.on('connection', function(socket) {
  socket.id = ++socketCounter;
  sockets[socket.id] = socket;

  socket.on('data', function(message) {
    _.forEach(sockets, function(socket) {
      socket.write(message);
    });
    console.log(_.keys(sockets).length);
  });

  socket.on('close', function() {
    _.remove(sockets, function(sock) {
      return socket.id === sock.id;
    });
    console.log(_.keys(sockets).length);
  });

});

// 2. Express server
var app = express();
app.use(express.static('.'));
var server = http.createServer(app);
sockjs_server.installHandlers(server, {prefix:'/echo'});

console.log(' [*] Listening on port 3000' );
server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
