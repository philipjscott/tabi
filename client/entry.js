'use strict'

import Controller from 'key-controller'
import View from './view'
import virtuals from './virtuals'
import * as Colyseus from 'colyeus.js'

const wsUrl = window.location.port
  ? `ws://${window.location.host}:${window.location.port}`
  : `ws://${window.location.host}`
const client = new Colyseus.Client(wsUrl)
const room = client.join('tabi')

const controller = new Controller(room, virtuals)
const view = new View()
const keymap = {
  jump: ['ArrowUp', 'w'],
  left: ['ArrowLeft', 'a'],
  right: ['ArrowRight', 'd']
}

controller.register(keymap)
room.listen('players/:id', change => view.updatePlayer(change))
room.listen('players/:id/:attribute', change => view.updatePosition(change))