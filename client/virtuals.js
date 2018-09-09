'use strict'

const movements = ['jump', 'left', 'right']
let virtuals = {}

movements.forEach((key) => {
  virtuals[key] = {
    keydown (transmitter) {
      let data = {}
      data[key] = true

      transmitter.send(data)
    },
    keyup (transmitter) {
      let data = {}
      data[key] = false

      transmitter.send(data)
    }
  }
})

export default virtuals
