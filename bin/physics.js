const { Engine, World, Bodies, Body } = require('matter-js')

class Simulation {
  constructor (colyseusPlayers, playerMoveSets) {
    global.window = {}
    this.engine = Engine.create()
    this.colyseusPlayers = colyseusPlayers
    this.players = {}
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, frictionStatic: 0, friction: 0.04, label: 'ground' })
    this.engine.world.gravity.y = 1
    World.add(this.engine.world, [ground])
    Engine.run(this.engine)
    setInterval(() => {
      this.gameLoop(playerMoveSets)
    }, 31.25)
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
