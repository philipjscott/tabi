'use strict'

function registerRooms (gameServer) {
  const roomMap = {
    'tabi': 'tabi'
  }

  for (const name in roomMap) {
    gameServer.register(name, require(`./rooms/${roomMap[name]}`))
  }
}

module.exports = registerRooms
