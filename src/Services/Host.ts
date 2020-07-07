import {injectable} from 'inversify';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {HostConfig} from "./HostConfig";

@injectable()
export class Host
{
    private server;
    private httpServer;
    private socketHost;

    constructor(private _config: HostConfig)
    {
        this.server = express();
        this.httpServer = http.createServer(this.server);
        this.socketHost = socketIo(this.httpServer);

        this.server.use(cors({exposedHeaders: 'Content-Length'}));
        this.server.use(bodyParser.json());

        this.server.get('/favicon.ico', (req, res) => res.status(204));
        this.server.get('/ping', (req, res) => res.send('pong'));

        this.server.use('/public', express.static(this.ClientDir));

        process.on('SIGINT', () =>
        {
            this.httpServer?.close(() => console.log('SERVER CLOSED'));
        });
    }


    public get ClientDir(): string
    {
        const s = __dirname.split(path.sep);
        const dir = [s.slice(0, s.length - 2).join(path.sep), 'public'].join(path.sep);
        // console.log('Static files @', dir);
        return dir;
    }


    public Start()
    {
        this.httpServer.listen(this._config.Port, () => console.log('SERVER STARTED @ ' + this._config.Port));
    }
    public get SocketHost()
    {
        return this.socketHost;
    }


    public OnGet(url: string, callback: (req: any, res: any) => Promise<void>): void
    {
        this.server.get(url, callback);
    }


    public OnPost(url: string, callback: (req: any, res: any) => Promise<void>): void
    {
        this.server.post(url, callback);
    }
}
