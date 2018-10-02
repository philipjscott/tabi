'use strict'

const { World, Bodies } = require('matter-js')
const { GRAVITY } = require('../../config')

function buildmap (engine) {
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, frictionStatic: 0, friction: 0.04, label: 'ground' })

  engine.world.gravity.y = GRAVITY
  World.addBody(engine.world, ground)
}

module.exports = buildmap
