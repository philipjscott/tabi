var game = new Phaser.Game(600, 450, Phaser.AUTO, 'game', {preload : preload, create: create, update: update, render: render });

function preload() {
  game.load.spritesheet('ninja', 'assets/ninja.png', 13, 15);
  game.load.image('boulder', 'assets/boulder.png');
}

var player;
var boulders;
var cursors;
var jumpButton;
var facing = 'left'

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 400;
  game.stage.backgroundColor = '#ffffff';

  // add srpites
  player = game.add.sprite(100, 100, 'ninja');
  boulders = game.add.group();

  // boulder config
  game.physics.enable(boulders, Phaser.Physics.ARCADE);
  boulders.createMultiple(30, 'boulder');
  boulders.setAll('outOfBoundsKill', true);
  boulders.setAll('checkWorldBounds', true);
  boulders.scale.setTo(3, 3);
  boulders.smoothed = false;
  
  // player config
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.animations.add('right', [0,1,2,3,4], 10, true);
  player.animations.add('left', [5,6,7,8,9], 10, true);
  player.animations.add('idleRight', [10, 11], 1, true);
  player.animations.add('idleLeft', [12, 13], 1, true);
  player.scale.setTo(3, 3);
  player.smoothed = false;

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  player.body.velocity.x = 0;

  if (jumpButton.isDown) {
    //player.body.velocity.y = -200;
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
}

function render() {
}
