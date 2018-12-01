const socket = io();

socket.on('connect', () =>
{
    console.log('Connected to server');
});

socket.on('disconnect', () =>
{
    console.log('Disconnected from server');
});

socket.on('state', (state) =>
{
    document.querySelector('#data').textContent = JSON.stringify(state);

    const monkeyPic = state ? 'hanging-monkey.png' : 'siting-monkey.png';
    document.querySelector('#pic').setAttribute('src', monkeyPic);
});