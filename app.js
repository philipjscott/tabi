// server init

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var active = false;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
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



// game logic
var BOULDER_TIME_INIT = 3000;
var boulderTime = BOULDER_TIME_INIT;
var boulderTimer;

function Boulder() {
  this.x = Math.random() * 600 / 5;
  this.velocity = Math.random() * 100 - 50;
  this.angularVelocity = Math.random() * 1000 - 500;
}

function setBoulderTimer() {
  return setInterval(function() {
    io.sockets.emit('create boulder', new Boulder());
  }, boulderTime);
}

boulderTimer = setBoulderTimer();

/* logic for speeding up
setInterval(function() {
  boulderTime = Math.round(boulderTime / 1.2);
  console.log('speed up!');
  clearInterval(boulderTimer);
  boulderTimer = setBoulderTimer()
}, 10000);
*/

io.on('connection', function(socket) {
  socket.emit('player connect');
  socket.on('update server', function(data) {
    socket.broadcast.emit('update client', data);
  });
  socket.on('all dead', function() {
    boulderTime = BOULDER_TIME_INIT;
  });
});

