const socket = io('/web');

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
    // document.querySelector('#data').textContent = JSON.stringify(state);
    console.log('state:', state);

    const monkeyPic = state ? 'hanging-monkey.png' : 'siting-monkey.png';
    document.querySelector('#pic').setAttribute('src', monkeyPic);
});

socket.on('monkey-update', monkeyUpdate =>
{
    console.log('monkey-update', monkeyUpdate);
});