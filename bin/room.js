const { Room } = require('colyseus')
const Player = require('../game/player.js')
const BoulderManager = require('./boulder')

class TabiRoom extends Room {
  // When room is initialized
  onInit () {
    this.setState({
      players: {},
      boulders: {}
    })

    const boulder = new BoulderManager()
    boulder.DifficultyIncrementor()
    boulder.BoulderSpawner(this.state)
  }

  // When client successfully join the room
  onJoin (client) {
    this.state.players[client.sessionId] = new Player(0, 0, 'right')
    console.log(`Player ${client.sessionId} has joined the session!`)
  }

  // When a client leaves the room
  onLeave (client) {
    delete this.state.players[client.sessionId]
    console.log(`Player ${client.sessionId} has left the session!`)
  }

  // When a client sends a message
  onMessage (client, data) {
    // const player = this.state.players[client.sessionId]

    switch (data.move) {
      case 'left':
        console.log(`Player ${client.sessionId} has moved left`)
        break
      case 'right':
        console.log(`Player ${client.sessionId} has moved right`)
        break
      case 'jump':
        console.log(`Player ${client.sessionId} has jumped!`)
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () {
    console.log('All players left the room. Instance shutting down.')
  }
}

module.exports = TabiRoom
