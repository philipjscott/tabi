'use strict'

const { Player, Boulder } = require('./models')

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

  spawnBoulder() {

  }
}

module.exports = TabiState
