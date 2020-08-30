const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New WebSocket Connection');

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', generateMessage(`Welcome ${user.username}!`));
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage(`${user.username} has joined!`));

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) return callback('Profanity is not allowed!');

    io.to('sport').emit('message', generateMessage(message));

    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'LocationMessage',
      generateLocationMessage(
        `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user)
      io.to(user.room).emit(
        'message',
        generateMessage(`${user.username} has left!`)
      );
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is Up And Running on Port ${PORT}`);
});
