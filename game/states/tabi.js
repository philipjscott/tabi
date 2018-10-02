'use strict'

const { Player } = require('./models')

class TabiState {
  constructor () {
    this.players = {}
    this.boulders = {}
  }

  addPlayer (x, y, sessionId) {
    this.players[sessionId] = new Player(x, y)
  }

  removePlayer (sessionId) {
    delete this.players[sessionId]
  }

  getPlayer (sessionId) {
    return this.players[sessionId]
  }
}

module.exports = TabiState
