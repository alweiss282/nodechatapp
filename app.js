var express = require('express')
var html = require('http')

var app = express()
var server = html.createServer(app)

var io = require('socket.io')(server)
var path = require('path')

app.use(express.static(path.join(__dirname, './public')));

var name;

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.on('joining msg', (username) => {
    name = username
    io.emit('chat message', `---${name} joined the chat---`)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    io.emit('chat message', `---${name} left the chat---`)
  })

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg)
  })
})

server.listen(8080, () => {
  console.log("server listening on 8080...")
})