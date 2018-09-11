const { Engine, World, Bodies, Body, Events } = require('matter-js')

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
      this.gameLoop()
    }, 31.25)
  }

  addPlayer(sessionId){
    this.players[sessionId] = Bodies.rectangle(100, 200, 50, 80, { inertia: Infinity})
  }

  removePlayer(sessionId){
    delete this.players[sessionId]
  }

  updatePlayer(player, moveset){
    if(moveset.left){

    }
    if (moveset.right){

    }
    if (moveset.jump){

    }
  }

  gameLoop (playerMoveSets) {
    for (player in playerMoveSets) {
      updatePlayer(player, playerMoveSets[player])
    }
    for (const sessionId in this.players) {
      const players = this.players
      this.colyseusPlayers[sessionId].x = players[sessionId].position.x
      this.colyseusPlayers[sessionId].y = players[sessionId].position.y
      //console.log(this.colyseusPlayers[sessionId].x, this.colyseusPlayers[sessionId].y);
    }
    Engine.update(this.engine)
  }
}

module.exports = Simulation
