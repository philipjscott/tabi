var socket = io();

var game = new Phaser.Game(600, 450, Phaser.AUTO, 'game', {preload : preload, create: create, update: update, render: render });

function preload() {
  game.load.spritesheet('ninja', 'assets/sprites/ninja.png', 13, 15);
  game.load.spritesheet('rival', 'assets/sprites/rival.png', 13, 15);
  game.load.image('boulder', 'assets/sprites/boulder.png');
  game.load.audio('music', 'assets/audio/music.mp3');
  game.load.audio('death', 'assets/audio/death.mp3');
}

var multi = false;
var player;
var rival;
var boulders;
var cursors;
var jumpButton;
var firingTimer = 0;
var facing = 'left';
var score = 0;
var bestScore = 0;
var startTime = 0;
var lifeText;
var deaths = 0;
var replayTimer = 0; 
var scoreText;
var music;
var deathSfx;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 300;
  game.stage.backgroundColor = '#ffffff';

  // add srpites
  rival = game.add.sprite(300, 430, 'rival');
  player = game.add.sprite(300, 430, 'ninja');
  boulders = game.add.group();

  // boulder config
  boulders.setAll('outOfBoundsKill', true);
  boulders.setAll('checkWorldBounds', true);
  boulders.enableBody = true;
  boulders.physicsBodyType = Phaser.Physics.ARCADE;
  boulders.scale.setTo(5, 5);
  
  // player config
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.animations.add('right', [0,1,2,3,4], 10, true);
  player.animations.add('left', [5,6,7,8,9], 10, true);
  player.animations.add('idleRight', [10, 11], 1, true);
  player.animations.add('idleLeft', [12, 13], 1, true);
  player.scale.setTo(3, 3);
  player.smoothed = false;

  // rival config
  game.physics.enable(rival, Phaser.Physics.ARCADE);
  rival.body.collideWorldBounds = true;
  rival.animations.add('right', [0,1,2,3,4], 10, true);
  rival.animations.add('left', [5,6,7,8,9], 10, true);
  rival.animations.add('idleRight', [10, 11], 1, true);
  rival.animations.add('idleLeft', [12, 13], 1, true);
  rival.scale.setTo(3, 3);
  rival.smoothed = false;

  // game text
  lifeText = game.add.text(20, 20, deaths + ' deaths', {font: '20px Helvetica', fill: '#000000', align: 'left'});
  scoreText = game.add.text(20, 40, '', {font: '20px Helvetica', fill: '#000000', align: 'left'});

  // audio
  music = game.add.audio('music');
  deathSfx = game.add.audio('death');
  deathSfx.volume = 0.2;
  music.play();

  // buttons
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  player.body.velocity.x = 0;

  // jumping
  if (jumpButton.isDown &&
      player.body.onFloor()) {
    player.body.velocity.y = -200;
  }

  // left / right controls
  if (cursors.left.isDown) {
    facing = 'left';
    player.animations.play('left');
    player.body.velocity.x = -200;
  } 
  else if (cursors.right.isDown) {
    facing = 'right';
    player.animations.play('right');
    player.body.velocity.x = 200;
  } else {
    if (facing === 'left') {
      player.animations.play('idleLeft');
    } else {
      player.animations.play('idleRight');
    }
  }

  // boulder generation
  if (game.time.now > firingTimer) {
    generateBoulder();
  }

  // set score
  score = (game.time.now - startTime) / 1000;
  scoreText.text = 'time: ' + score;
  // multiplayer handler
  if (multi) {
    var myData = {x: player.body.x, y: player.body.y};
    //console.log(myData);
    socket.emit('update server', myData);
    socket.on('update client', function(data) {
      rival.position.x = data.x;
      rival.position.y = data.y;
    });
  }

  game.physics.arcade.overlap(boulders, player, boulderHitsPlayer, null, this);
}

function generateBoulder() {
  var boulder = boulders.create(Math.random() * 600 / 5, 0, 'boulder');
  boulder.smoothed = false;
  boulder.body.velocity.x = Math.random() * 100 - 50;
  boulder.anchor.setTo(0.5,0.5);
  boulder.body.angularVelocity = Math.random() * 1000 - 500;
  firingTimer = game.time.now + 500;
}

function boulderHitsPlayer() {
  if (game.time.now > replayTimer) {
    deaths++;
    if (score > bestScore) {
      bestScore = score;
    }
    score = 0;
    startTime = game.time.now;
    deathSfx.play();
    replayTimer = game.time.now + 500;
    lifeText.text = deaths + ' deaths. best time: ' + bestScore;
  }
}

function render() {}

// toggle multiplayer on connection
socket.on('player connect', function() {
  console.log('multi ON');
  multi = true;
});
