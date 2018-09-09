'use strict'

const express = require('express')
const app = express()
const path = require('path')

app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/index.html'))
})

module.exports = app
