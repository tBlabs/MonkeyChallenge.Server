import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { IStartupArgs } from './Services/Environment/IStartupArgs';
import { IRunMode } from './Services/RunMode/IRunMode';
import { Socket } from 'net';

// @injectable()
// export class WebClients
// {
//     private collection: Socket[] = [];

//     public Add(socket: Socket)
//     {
//         this.collection.push(socket);
//     }

//     public get List()
//     {
//         return this.collection;
//     }

//     public SendMonkeyUpdate()
//     {

//     }
// }

// export class Monkey
// {
//     constructor(
//         public socket: Socket,
//         public id: string)
//     { 

//     }
// }

// @injectable()
// export class ProxyClients
// {
//     private collection: Monkey[] = [];

//     constructor(private _webClients: WebClients)
//     { }

//     public Add(monkey: Monkey)
//     {
//         this.collection.push(monkey);

//         monkey.socket.on('laser-sensor-state-change', (state) =>
//         {
//             this._webClients.List.forEach((webClient) =>
//             {
//                 webClient.SendMonkeyUpdate(monkey);
//             });
//         });
//     }
// }

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IRunMode) private _runMode: IRunMode
    )
    // private _webClients: WebClients,
    // private _proxyClients: ProxyClients)
    { }

    private get ClientDir(): string
    {
        const s = __dirname.split(path.sep); // __dirname returns '/home/tb/projects/EventsManager/bin'. We don't wanna 'bin'...
        return s.slice(0, s.length - 1).join(path.sep) + '/client';
    }

    public async Start(): Promise<void>
    {
        const server = express();
        const httpServer = http.createServer(server);
        const socketHost = socketIo(httpServer);
        const webSocketHost = socketHost.of('/web');
        const monkeySocketHost = socketHost.of('/monkey');

        webSocketHost.on('connection', (socket) =>
        {
            console.log('web', socket.id);
        });

        monkeySocketHost.on('connection', (socket) =>
        {
            const monkeyId = socket.handshake.query.id;
            console.log('monkey', socket.id, monkeyId);

            socket.on('monkey-update', update=>{
              //  console.log(update);
                webSocketHost.emit('monkey-update', update);
            })
        });

        let guard = 0;
        let state = 0;
        setInterval(() =>
        {
            state = 1 - state;
            webSocketHost.emit('monkey-update', { id: "GhostMonkey", state: state, timestamp: +new Date(), guard: guard++ });
        },
            1000);

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.get('/ping', (req, res) => res.send('pong'));

        server.use(express.static(this.ClientDir));



        // socketHost.on('connection', (webOrProxySocket) =>
        // {
        //     const clientType = webOrProxySocket.handshake.query.clientType;

        //     switch (clientType)
        //     {
        //         default:
        //             console.log('WEB (OR UNKNOWN) CLIENT CONNECTED', webOrProxySocket.id);
        //             // this._webClients.Add(webOrProxySocket);
        //             break;

        //         case "monkey-proxy":
        //             console.log('MONKEY-PROXY CONNECTED', webOrProxySocket.id);
        //             const monkeyId = webOrProxySocket.handshake.query.monkeyId;
        //             // this._proxyClients.Add(new Monkey(webOrProxySocket, monkeyId));
        //             break;
        //     }
        // });

        const port = this._runMode.IsDev ? 4000 : process.env.PORT;
        httpServer.listen(port, () => console.log('SERVER STARTED @ ' + port));

        process.on('SIGINT', () =>
        {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
}
