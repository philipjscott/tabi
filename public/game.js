var game = new Phaser.Game(600, 450, Phaser.AUTO, 'game', {preload : preload, create: create, update: update, render: render });

function preload() {
  game.load.spritesheet('ninja', 'assets/ninja.png', 13, 15);
  game.load.image('boulder', 'assets/boulder.png');
}

var player;
var boulders;
var cursors;
var jumpButton;
var firingTimer = 0;
var facing = 'left';
var lifeText;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 300;
  game.stage.backgroundColor = '#ffffff';

  // add srpites
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

  lifeText = game.add.text(30, 30, 'Alive', {font: '30px Helvetica', fill: '#000000', align: 'left'});

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
  lifeText.text = 'Dead';
}

function render() {}
