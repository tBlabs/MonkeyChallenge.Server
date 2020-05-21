import { MonkeysFactory } from "./Monkey/MonkeysFactory";
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { IStartupArgs } from './Services/Environment/IStartupArgs';
import { IRunMode } from './Services/RunMode/IRunMode';
import { SessionRepository } from './Persistance/Repository';
import { WebClients } from './WebClients';
import { Session } from './Persistance/Session';

class GhostMonkeySocket
{
    public handshake = { query: { id: "GhostMonkey3" } };
    public on(event: string, callback: any)
    {
        if (event === 'update')
        {
            let x = 0;
            setInterval(() =>
            {
                x=1-x;
                callback({ SensorA: x });
            },
                3000);

            let p = 0;
            setInterval(() =>
            {
                p=1-p;
                callback({ SensorB: p });
            },
                700);
        }
    }
}

@injectable()
export class Main
{
    constructor(
        private _repo: SessionRepository,
        private _monkeysFactory: MonkeysFactory,
        private _webClients: WebClients
    )
    { }

    private get ClientDir(): string
    {
        // const s = __dirname.split(path.sep); // __dirname returns '/home/tb/projects/EventsManager/bin'. We don't wanna 'bin'...
        // const dir = [s.slice(0, s.length - 1), 'client'].join(path.sep);
        const dir = "C:\\PrivProjects\\monkey-challenge-server\\client";
        // const dir = __dirname;
        console.log('Static files dir:', dir);
        return dir;
    }

    public async Start(): Promise<void>
    {
        console.log('start');

        // if (0)
         await this._repo.Connect();

            // this._repo.AddSession(new Session("TestMonkey", "2020-1-1", "12:12:12", 5000, 5));
  
            // return


        const server = express();
        const httpServer = http.createServer(server);
        const socketHost = socketIo(httpServer);
        const webSocketHost = socketHost.of('/web');
        const monkeySocketHost = socketHost.of('/monkey');

        
        webSocketHost.on('connection', (socket) =>
        {
            console.log('web connection @', socket.id);
            
            this._webClients.Add(socket);
        });
        
        monkeySocketHost.on('connection', (socket) =>
        {
            // new Monkey(socket);
            this._monkeysFactory.Create(socket);
        });
        
        this._monkeysFactory.Create(new GhostMonkeySocket());

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.get('/', (req, res) => res.send('Please go to /index.html'));
        server.get('/ping', (req, res) => res.send('pong'));
        server.get('/monkey', (req, res) => res.send('pong'));


        server.use('/', express.static(this.ClientDir));



        httpServer.listen(process.env.PORT, () => console.log('MONKEY CHALLENGE SERVER STARTED @ ' + process.env.PORT));

        process.on('SIGINT', () =>
        {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
}
