'use strict'

var colyseus = require('colyseus')
var http = require('http')
var express = require('express')
var app = express()
var server = http.createServer(app)
var gameServer = new colyseus.Server({server: server})
// might need to use 3553
var webserverPort = process.env.PORT || 8080

gameServer.register('tabi', require('./rooms/tabi'))

app.use(express.static(__dirname + '../frontend/public'))

server.listen(webserverPort, () => {
  console.log(`Started listening on port ${port}`)
})



