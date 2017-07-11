// server init
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
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
var io = require('socket.io')(server);
var playerIds = [];

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
  // new client loads other plays via ids
  socket.join(socket.id);
  playerIds.push(socket.id);
  io.sockets.in(socket.id).emit('load players', playerIds);

  console.log(playerIds);
 
  // inform clients of new player
  socket.broadcast.emit('player connect', socket.id);

  // data pushed to server gets relayed to clients
  socket.on('update server', function(data) {
    socket.broadcast.emit('update client', data);
  });
  socket.on('all dead', function() {
    boulderTime = BOULDER_TIME_INIT;
  });

  // tell other clients of a disconnect, and remove from array
  socket.on('disconnect', function() {
    socket.broadcast.emit('player disconnect', socket.id);
    playerIds.splice(playerIds.indexOf(socket.id), 1);
  });
});

