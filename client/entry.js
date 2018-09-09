/* global Phaser */

import * as Colyseus from 'colyeus.js'
import gameMusic from './assets/audio/music.mp3'
import deathSound from './assets/audio/death.mp3'
import playerSprite from './assets/sprites/ninja.png'
import rivalSprite from './assets/sprites/rival.png'
import boulderSprite from './assets/sprites/boulder.png'

const wsUrl = window.location.port
  ? `ws://${window.location.host}:${window.location.port}`
  : `ws://${window.location.host}`
const client = new Colyseus.Client(wsUrl)
const room = client.join('tabi')

room.listen('players/:id', (change) => view.updatePlayer(change))
room.listen('players/:id/:attribute', (change) => view.updatePosition)


var game = new Phaser.Game(600, 450, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render })

function preload () {
  game.load.spritesheet('ninja', playerSprite, 13, 15)
  game.load.spritesheet('rival', rivalSprite, 13, 15)
  game.load.image('boulder', boulderSprite)
  game.load.audio('music', gameMusic)
  game.load.audio('death', deathSound)

  // make the game continue to run on lose focus
  game.stage.disableVisibilityChange = true
}

var player
var boulders
var cursors
var jumpButton
var facing = 'left'
var score = 0
var bestScore = 0
var startTime = 0
var lifeText
var deaths = 0
var replayTimer = 0
var scoreText
var music
var deathSfx
var createDone = false
var enemyIds = []
var enemies = {}

socketInit()

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.physics.arcade.gravity.y = 300
  game.stage.backgroundColor = '#ffffff'

  // add sprites
  player = game.add.sprite(300, 430, 'ninja')
  boulders = game.add.group()

  // boulder config
  boulders.setAll('outOfBoundsKill', true)
  boulders.setAll('checkWorldBounds', true)
  boulders.enableBody = true
  boulders.physicsBodyType = Phaser.Physics.ARCADE
  boulders.scale.setTo(5, 5)

  // player config
  game.physics.enable(player, Phaser.Physics.ARCADE)
  player.body.collideWorldBounds = true
  player.animations.add('right', [0, 1, 2, 3, 4], 10, true)
  player.animations.add('left', [5, 6, 7, 8, 9], 10, true)
  player.animations.add('idleRight', [10, 11], 1, true)
  player.animations.add('idleLeft', [12, 13], 1, true)
  player.scale.setTo(3, 3)
  player.smoothed = false

  // game text
  lifeText = game.add.text(20, 20, deaths + ' deaths', { font: '20px Helvetica', fill: '#000000', align: 'left' })
  scoreText = game.add.text(20, 40, '', { font: '20px Helvetica', fill: '#000000', align: 'left' })

  // audio
  music = game.add.audio('music')
  deathSfx = game.add.audio('death')
  deathSfx.volume = 0.2
  music.play()

  // buttons
  cursors = game.input.keyboard.createCursorKeys()
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

  createDone = true
  gameReady()
}

function update () {
  if (socket.id !== undefined) {
    player.body.velocity.x = 0

    // jumping
    if (jumpButton.isDown &&
        player.body.onFloor()) {
      player.body.velocity.y = -200
    }

    // left / right controls
    if (cursors.left.isDown) {
      facing = 'left'
      player.animations.play('left')
      player.body.velocity.x = -200
    } else if (cursors.right.isDown) {
      facing = 'right'
      player.animations.play('right')
      player.body.velocity.x = 200
    } else {
      if (facing === 'left') {
        player.animations.play('idleLeft')
      } else {
        player.animations.play('idleRight')
      }
    }

    // set score
    score = (game.time.now - startTime) / 1000
    scoreText.text = 'time: ' + score

    // multiplayer handler
    var myData = {
      id: socket.id,
      x: player.body.x,
      y: player.body.y
    }
    socket.emit('update server', myData)
    socket.on('update client', function (data) {
      if (enemies[data.id]) {
        enemies[data.id].position.x = data.x
        enemies[data.id].position.y = data.y
      }
    })

    game.physics.arcade.overlap(boulders, player, boulderHitsPlayer, null, this)
  }
}

function generateBoulder (x, velocity, angularVelocity) {
  var boulder = boulders.create(x, 0, 'boulder')
  boulder.smoothed = false
  boulder.body.velocity.x = velocity
  boulder.anchor.setTo(0.5, 0.5)
  boulder.body.angularVelocity = angularVelocity
}

function boulderHitsPlayer () {
  if (game.time.now > replayTimer) {
    deaths++
    if (score > bestScore) {
      bestScore = score
    }
    score = 0
    startTime = game.time.now
    deathSfx.play()
    replayTimer = game.time.now + 500
    lifeText.text = deaths + ' deaths. best time: ' + bestScore
  }
}

function render () {}

function socketInit () {
  socket.on('load players', function (ids) {
    loadIds(ids)
  })
}
function gameReady () {
  console.log('game ready')
  generatePlayers()
  socket.on('player connect', function (id) {
    console.log('connect: ' + id)
    generatePlayer(id)
  })
  socket.on('create boulder', function (data) {
    if (createDone && socket.id !== undefined) {
      generateBoulder(data.x, data.velocity, data.angularVelocity)
    }
  })
  socket.on('player disconnect', function (id) {
    console.log('disconnect: ' + id)
    enemies[id].destroy()
    delete enemies[id]
  })
}
function loadIds (ids) {
  console.log('all ids : ' + ids)
  enemyIds = ids
}
function generatePlayers () {
  for (var i = 0; i < enemyIds.length; i++) {
    // server sends full list of ids, including own client
    if (enemyIds[i] !== socket.id) {
      generatePlayer(enemyIds[i])
    }
  }
}
function generatePlayer (id) {
  enemies[id] = game.add.sprite(300, 400, 'rival')
  enemies[id].animations.add('right', [0, 1, 2, 3, 4], 10, true)
  enemies[id].animations.add('left', [5, 6, 7, 8, 9], 10, true)
  enemies[id].animations.add('idleRight', [10, 11], 1, true)
  enemies[id].animations.add('idleLeft', [12, 13], 1, true)
  enemies[id].scale.setTo(3, 3)
  enemies[id].smoothed = false
}
