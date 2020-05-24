export class GhostMonkeySocket
{
    constructor(private name, private int1, private int2)
    { }
    public id = "FakeSocketId";
    public handshake = { query: { id: this.name } };
    public on(event: string, callback: any)
    {
        if (event === 'update')
        {
            let x = 0;
            setInterval(() =>
            {
                x = 1 - x;
                callback({ SensorA: x });
            }, this.int1);
            let p = 0;
            setInterval(() =>
            {
                p = 1 - p;
                callback({ SensorB: p });
            }, this.int2);
        }
    }
}
