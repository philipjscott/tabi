'use strict'

const { Engine, World, Bodies, Body } = require('matter-js')
const buildmap = require('./buildmap')
const {
  PHYSICS_FPS,
  PLAYER_SIZE,
  WORLD_BOUNDS,
  PLAYER_JUMP,
  PLAYER_SPEED } = require('../../config')

global.window = {}

class Simulation {
  constructor (colyseusState) {
    this.engine = Engine.create()
    this.colyseusState = colyseusState
    this.playerMovesets = {}
    this.playerBodies = {}
    this.boulderBodies = {}

    this.engine.world.bounds = WORLD_BOUNDS
    buildmap(this.engine)
    Engine.run(this.engine)

    setInterval(() => {
      this._tick()
    }, 1000 / PHYSICS_FPS)
  }

  addPlayer (sessionId) {
    const { x, y } = this._randomSpawn(PLAYER_SIZE, WORLD_BOUNDS)
    const playerBody = Bodies.rectangle(x, y, PLAYER_SIZE.width, PLAYER_SIZE.height)

    this.playerBodies[sessionId] = playerBody
    World.addBody(this.engine.world, playerBody)
    this.playerMovesets[sessionId] = {}
    this.colyseusState.addPlayer(x, y, sessionId)
  }

  removePlayer (sessionId) {
    delete this.playerBodies[sessionId]
    delete this.playerMovesets[sessionId]
    this.colyseusState.removePlayer(sessionId)
  }

  movePlayer (sessionId, message) {
    this.playerMovesets[sessionId][message.action] = message.data
  }

  _updatePlayer (id) {
    const body = this.playerBodies[id]
    const moveset = this.playerMovesets[id]
    const state = this.colyseusState.getPlayer(id)

    if (!state.alive) {
      return
    }

    if (moveset.left) {
      Body.setVelocity(body, { x: -PLAYER_SPEED, y: body.velocity.y })
    }
    if (moveset.right) {
      Body.setVelocity(body, { x: PLAYER_SPEED, y: body.velocity.y })
    }
    if (moveset.jump) {
      Body.setVelocity(body, { x: body.velocity.x, y: -PLAYER_JUMP })
    }

    state.x = body.position.x
    state.y = body.position.y
    state.theta = body.angle
  }

  _randomSpawn (size, bounds) {
    const x = (bounds.min.x + size.width / 2) + Math.random() * (bounds.max.x - size.width / 2)
    const y = (bounds.min.y + size.height / 2) + Math.random() * (bounds.max.y - size.height / 2)

    return { x, y }
  }

  _tick () {
    Engine.update(this.engine)

    for (const id in this.colyseusState.players) {
      this._updatePlayer(id)
    }
  }
}

module.exports = Simulation
