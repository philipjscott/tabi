import { Engine, Render, World, Bodies, Body, Events } from 'matter-js'

class Simulation {
  onInit (colyseusPlayers) {
    this.engine = Engine.create()
    this.colyseusPlayers = colyseusPlayers
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, frictionStatic: 0, friction: 0.04, label: 'ground' })
    this.engine.world.gravity.y = 1
    World.add(this.engine.world, [ground])
    Engine.run(engine)
    gameLoop()
  }

  updatePlayer(player, moveset){
    if(moveset.left){
      this.players
    }
    if (moveset.right){

    }
    if (moveset.jump){

    }
  }

  gameLoop (playerMoveSets) {
    for player in playerMoveSets {
      updatePlayer(player, playerMoveSets[player])
    }
    Engine.update(this.engine)
  }
}
