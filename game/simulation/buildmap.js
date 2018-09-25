'use strict'

const { World, Bodies } = require('matter-js')

function buildmap (engine) {
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, frictionStatic: 0, friction: 0.04, label: 'ground' })

  engine.world.gravity.y = 1
  World.add(this.engine.world, [ ground ])
}

module.exports = buildmap
