const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let message = e.target.elements.message;
  socket.emit('sendMessage', message.value);
  message.value = '';
});
