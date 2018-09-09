'use strict'

function gamify (io) {
  const BOULDER_TIME_INIT = 3000
  const playerIds = []
  let boulderTime = BOULDER_TIME_INIT
  let boulderTimer

  function Boulder () {
    this.x = Math.random() * 600 / 5
    this.velocity = Math.random() * 100 - 50
    this.angularVelocity = Math.random() * 1000 - 500
  }

  function setBoulderTimer () {
    return setInterval(function () {
      io.sockets.emit('create boulder', new Boulder())
    }, boulderTime)
  }

  boulderTimer = setBoulderTimer()

  /* logic for speeding up */
  setInterval(function () {
    boulderTime = Math.round(boulderTime / 1.2)
    console.log('speed up!')
    clearInterval(boulderTimer)
    boulderTimer = setBoulderTimer()
  }, 5000)

  io.on('connection', function (socket) {
    // new client loads other plays via ids
    socket.join(socket.id)
    playerIds.push(socket.id)
    io.sockets.in(socket.id).emit('load players', playerIds)

    console.log(playerIds)

    // inform clients of new player
    socket.broadcast.emit('player connect', socket.id)

    // data pushed to server gets relayed to clients
    socket.on('update server', function (data) {
      socket.broadcast.emit('update client', data)
    })
    socket.on('all dead', function () {
      boulderTime = BOULDER_TIME_INIT
    })

    // tell other clients of a disconnect, and remove from array
    socket.on('disconnect', function () {
      socket.broadcast.emit('player disconnect', socket.id)
      playerIds.splice(playerIds.indexOf(socket.id), 1)
    })
  })
}

module.exports = gamify
