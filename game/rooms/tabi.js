'use strict'

const { Room } = require('colyseus')
const Simulation = require('../physics')
const TabiState = require('../state/tabi')

class TabiRoom extends Room {
  onInit () {
    this.setState(new TabiState())
    this.simulation = new Simulation(this.state)
  }

  onJoin (client) {
    this.simulation.addPlayer(client.sessionId)

    console.log(`Player ${client.sessionId} has joined the session!`)
  }

  onLeave (client) {
    this.simulation.removePlayer(client.sessionId)

    console.log(`Player ${client.sessionId} has left the session!`)
  }

  onMessage (client, message) {
    this.simulation.movePlayer(client.sessionId, message)

    console.log(`Player ${client.sessionId} has moved ${message.action}`)
  }

  onDispose () {
    console.log('All players left! Destroying room...')
  }
}

module.exports = TabiRoom
