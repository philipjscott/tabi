'use strict'

const { Engine, World, Bodies, Body } = require('matter-js')
const { physicsFPS } = require('../config')
const buildmap = require('./buildmap')

global.window = {}

class Simulation {
  constructor (colyseusState, playerMoveSets) {
    this.engine = Engine.create()
    this.colyseusState = colyseusState
    this.playerBodies = {}
    this.boulderBodies = {}

    buildmap(this.engine)
    Engine.run(this.engine)

    setInterval(() => {
      this.gameLoop(playerMoveSets)
    }, 1000 / physicsFPS)
  }

  addPlayer (sessionId) {
    this.players[sessionId] = Bodies.rectangle(100, 200, 50, 80)
    World.add(this.engine.world, [this.players[sessionId]])
  }

  removePlayer (sessionId) {
    delete this.players[sessionId]
    // Add player removed from world
  }

  updatePlayer (player, moveset) {
    if (moveset.left) {
      Body.setVelocity(player, { x: -3, y: player.velocity.y })
    }
    if (moveset.right) {
      Body.setVelocity(player, { x: 3, y: player.velocity.y })
    }
    if (moveset.jump) {
      Body.setVelocity(player, { x: player.velocity.x, y: -10 })
    }
  }

  gameLoop (playerMoveSets) {
    for (const player in playerMoveSets) {
      this.updatePlayer(this.players[player], playerMoveSets[player])
    }
    for (const sessionId in this.players) {
      const players = this.players
      this.colyseusPlayers[sessionId].x = players[sessionId].position.x
      this.colyseusPlayers[sessionId].y = players[sessionId].position.y
      this.colyseusPlayers[sessionId].theta = players[sessionId].angle
      // console.log(this.colyseusPlayers[sessionId].x, this.colyseusPlayers[sessionId].y);
    }
    Engine.update(this.engine)
  }
}

module.exports = Simulation
