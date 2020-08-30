const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  let message = e.target.elements.message;
  socket.emit('sendMessage', message.value, (error) => {
    if (error) return console.log(error);

    console.log('Message delivered');
  });

  message.value = '';
});

document.getElementById('send-location').addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log('Location shared !');
      }
    );
  });
});
