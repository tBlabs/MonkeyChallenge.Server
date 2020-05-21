import { injectable } from 'inversify';

@injectable()
export class WebClients
{
    private collection: any[] = [];

    public Add(socket: any)
    {
        socket.on('disconnect', ()=>{
            console.log('web client disconnected');
        })
        this.collection.push(socket);
    }

    public get List()
    {
        return this.collection;
    }

    public SendMonkeyUpdate(monkeyId, data: any)
    {
        this.collection.forEach((socket: any) =>
        {
            socket.emit('update', monkeyId, data);
        });

        // console.log(`Update sent to ${this.collection.length} web clients`);
    }
}
