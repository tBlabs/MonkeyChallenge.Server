const socket = io('/web');

socket.on('connect', () =>
{
    console.log('Connected to server');
});

socket.on('disconnect', () =>
{
    console.log('Disconnected from server');
});

socket.on('update', (monkeyId, sensorState) =>
{
    document.querySelector('#data').textContent = monkeyId + ": " + JSON.stringify(sensorState);

    console.log(monkeyId, sensorState);
});