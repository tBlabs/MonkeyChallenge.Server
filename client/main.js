const socket = io('/web');

socket.on('connect', () =>
{
    console.log('Connected to server');
});

socket.on('disconnect', () =>
{
    console.log('Disconnected from server');
});

// socket.on('state', (state) =>
// {
//     const monkeyPic = state ? 'hanging-monkey.png' : 'siting-monkey.png';
//     document.querySelector('#pic').setAttribute('src', monkeyPic);
// });

socket.on('monkeys-update', monkeysUpdate =>
{
    document.querySelector('#data').textContent = JSON.stringify(monkeysUpdate);

    console.log(monkeysUpdate);
});