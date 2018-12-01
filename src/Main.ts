import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { IStartupArgs } from './Services/Environment/IStartupArgs';
import { Repeater } from './Services/Repeater/Repeater';
import { IEnvironment } from './Services/Environment/IEnvironment';
import { IRunMode } from './Services/RunMode/IRunMode';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IRunMode) private _runMode: IRunMode)
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

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.get('/ping', (req, res) => res.send('pong'));

        server.use(express.static(this.ClientDir));



        socketHost.on('connection', (socket) =>
        {
            console.log('CLIENT CONNECTED', socket.id);

            socket.on('laser', (state) =>
            {
                console.log(state);
                socketHost.emit('state', state);
            });
        });

        const port = this._runMode.IsDev ? 4000 : process.env.PORT;
        httpServer.listen(port, () => console.log('SERVER STARTED @ ' + port));

        process.on('SIGINT', () =>
        {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
}
