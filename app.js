var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var active = false;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.emit('player connect');
  socket.on('update server', function(data) {
    socket.broadcast.emit('update client', data);
  });
});

app.use(express.static('public'));

setInterval(function() {
  if (active) {
    http.get('http://tabijs.herokuapp.com');
    active = false;
  }
}, 1000 * 60 * 29);

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log('listening!');
});
