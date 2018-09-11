import { Engine, Render, World, Bodies, Body, Events } from 'matter-js'

class Simulation {
  onInit(){
    this.engine = Engine.create()
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, frictionStatic: 0, friction: 0.04, label: 'ground' })
    this.engine.world.gravity.y = 1
    World.add(this.engine.world, [ground])
    Engine.run(engine)
    gameLoop()
  }

  gameLoop(){
    Engine.update(this.engine)
  }
}
