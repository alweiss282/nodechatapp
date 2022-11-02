const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const path = require('path')

app.use(express.static(path.join(__dirname, './public')));
const names = []

io.on('connection', (socket) => {
  console.log('new user connected')
  let name;

  socket.on('joining msg', (username) => {
    name = username
    names.push(name)
    io.emit('chat message', `---${name} joined the chat---`)
    io.emit('update names', names)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    names.splice(names.indexOf(name), 1)
    io.emit('chat message', `---${name} left the chat---`)
    io.emit('update names', names)
  })

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg)
  })
})

server.listen(8080, () => {
  console.log("server listening on 8080...")
})