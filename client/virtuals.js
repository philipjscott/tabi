'use strict'

const movements = {
  jump: false,
  left: false,
  right: false
}
let virtuals = {}

Object.keys(movements).forEach((key) => {
  virtuals[key] = {
    keydown (transmitter) {
      if (!movements[key]) {
        transmitter.send({ action: key, data: true })
      }

      movements[key] = true
    },
    keyup (transmitter) {
      transmitter.send({ action: key, data: false })
      movements[key] = false
    }
  }
})

export default virtuals
