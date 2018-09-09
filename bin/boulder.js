const uuid = require('uuid/v4')

const DIFFICULTY_INTERVAL = 5000
let SpawnInterval = 3000

class Boulder {
  constructor () {
    this.x = 0
    this.y = 0
  }
}

class BoulderManager {
  AddBoulder (gameState) {
    // console.log(`Boulder Spawned!, next spawn in ${SpawnInterval/1000} seconds!`);
    gameState.boulders[uuid()] = new Boulder()
  }

  DifficultyIncrementor () {
    setInterval(() => {
      SpawnInterval = SpawnInterval * 0.95
    }, DIFFICULTY_INTERVAL)
  }

  BoulderSpawner (gameState) {
    this.AddBoulder(gameState)
    setTimeout(() => { this.BoulderSpawner(gameState) }, SpawnInterval)
  }
}

module.exports = BoulderManager
