const { Room } = require('colyseus')
const Player = require('../game/player.js')
const BoulderManager = require('./boulder')
const Simulation = require('./physics')

class TabiRoom extends Room {
  // When room is initialized
  onInit () {
    this.setState({
      players: {},
      boulders: {}
    })
    this.playerMoveSets = {}
    this.simulation = new Simulation(this.state.players, this.playerMoveSets)
    const boulder = new BoulderManager()
    boulder.DifficultyIncrementor()
    boulder.BoulderSpawner(this.state)
  }

  // When client successfully join the room
  onJoin (client) {
    this.state.players[client.sessionId] = new Player(0, 0, 'right')
    this.playerMoveSets[client.sessionId] = { left: false, right: false, jump: false }
    this.simulation.addPlayer(client.sessionId)
    console.log(`Player ${client.sessionId} has joined the session!`)
  }

  // When a client leaves the room
  onLeave (client) {
    delete this.state.players[client.sessionId]
    delete this.playerMoveSets[client.sessionId]
    this.simulation.removePlayer(client.sessionId)
    console.log(`Player ${client.sessionId} has left the session!`)
  }

  // When a client sends a message
  onMessage (client, data) {
    switch (Object.keys(data)[0]) {
      case 'left':
        console.log(`Player ${client.sessionId} has moved right`)
        this.playerMoveSets[client.sessionId].left = data.left
        break
      case 'right':
        console.log(`Player ${client.sessionId} has moved right`)
        this.playerMoveSets[client.sessionId].right = data.right
        break
      case 'jump':
        console.log(`Player ${client.sessionId} has jumped!`)
        this.playerMoveSets[client.sessionId].jump = data.jump
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () {
    console.log('All players left the room. Instance shutting down.')
  }
}

module.exports = TabiRoom
