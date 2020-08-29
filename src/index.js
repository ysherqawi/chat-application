const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New WebSocket Connection');

  socket.emit('message', 'Welcome !');
  socket.broadcast.emit('message', 'A new user has joined !');

  socket.on('sendMessage', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left !');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is Up And Running on Port ${PORT}`);
});
