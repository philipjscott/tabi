'use strict'

import * as PIXI from 'pixi.js'
import * as assets from './assets'
import { cosineInterp } from './interp'

class View {
  constructor () {
    this._app = new PIXI.Application()
    this._sprites = {}
    this._positions = {}

    document.body.appendChild(this._app.view)
    this._renderLoop()
  }

  _renderLoop () {
    this._app.ticker.add((delta) => {
      for (const id in this._positions) {
        const lerpRate = 5
        const sprite = this._sprites[id]
        const position = this._positions[id]

        sprite.x = cosineInterp(sprite.x, position.x, delta / lerpRate)
        sprite.y = cosineInterp(sprite.y, position.y, delta / lerpRate)
      }
    })
  }

  _createPlayer (id, position) {
    const sprite = PIXI.Sprite.fromImage(assets.sprite)

    // skip lerp when initializing position
    sprite.x = position.x
    sprite.y = position.y

    this._positions[id] = position
    this._sprites[id] = sprite

    this._app.stage.addChild(sprite)
  }

  _removePlayer (id) {
    this._sprites[id].destroy()
    delete this._sprites[id]
    delete this._positions[id]
  }

  _updatePosition (id, coord, value) {
    this._positions[id][coord] = value
  }

  updatePlayer (change) {
    switch (change.operation) {
      case 'add':
        this._createPlayer(change.path.id, change.value.position)
        break
      case 'remove':
        this._removePlayer(change.path.id)
    }
  }

  updatePosition (change) {
    if (change.operation === 'replace') {
      this._updatePosition(change.path.id, change.path.attribute, change.value)
    }
  }
}

export default View
