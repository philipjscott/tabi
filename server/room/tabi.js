var Room = require('colyseus').Room

const PATCH_RATE = 20
const TURN_TIMEOUT = 10

class Tabi extends Room {
  constructor (options) {
    super(options, 1000 / PATCH_RATE)
    this.setState({

    })
  }

  onInit (options) {}
  onJoin (client) {}
  onLeave (client) {}
  onMessage (client, data) {}
  onDispose ()
}

module.exports = Tabi
