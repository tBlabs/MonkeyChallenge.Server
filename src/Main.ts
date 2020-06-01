import { MonkeysFactory } from "./Monkey/MonkeysFactory";
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as cors from 'cors';
import { SessionRepository } from './Persistance/Repository';
import { WebClients } from './WebClients';
import { Session, DailySummary, MonkeyDay, MonkeyId } from './Persistance/Session';
import { GhostMonkeySocket } from "./GhostMonkeySocket";

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
        const s = __dirname.split(path.sep);
        const dir = [s.slice(0, s.length - 2).join(path.sep), 'client'].join(path.sep);
        console.log('Static files @', dir);
        return dir;
    }

    public async Start(): Promise<void>
    {
        console.log('start');

        await this._repo.Connect();

        // await this._repo.Drop();
        if (0)
        {
            await this._repo.Drop();

            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 0, 1, 12, 0, 1), 5000, 1));
            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 0, 1, 12, 0, 1), 5000, 1));
            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 0, 1, 12, 10, 2), 5000, 1));
            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 1, 1, 13, 0, 3), 5000, 2));
            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 1, 1, 12, 10, 0), 5000, 2));
            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 1, 2, 10, 0, 0), 5000, 3));
            await this._repo.AddSession(new Session("TestMonkey", new Date(2020, 1, 2, 10, 10, 0), 5000, 3));
            await this._repo.AddSession(new Session("TestMonkey", new Date(), 5000, 3));
            await this._repo.AddSession(new Session("TestMonkey", new Date(), 5000, 3));

            let r: DailySummary[] = [];
            r = await this._repo.GetLastTotals("TestMonkey", 7);
            console.log('rrrrrrrr', r.map(x => JSON.stringify(x)));
            return
        }


        const server = express();
        server.use(cors());
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
            this._monkeysFactory.Create(socket);
        });

        this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey1", 3000, 700));
        this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey2", 8000, 1200));
        // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey3", 1000, 200));

        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/', (req, res) => {
            const msg = `
            <b>/index.html</b> - prints monkeys sensors state (only one change at a time)<br><br>
            <b>/monkeys</b> - returns summaries of all monkeys<br>
            <b>/last/:days/for/:monkeyId</b> - returns last {days} of MonkeyDay`;
            res.send(msg);
        });
        server.get('/ping', (req, res) => res.send('pong'));
        server.get('/last/:days/for/:monkeyId', async (req, res) =>
        {
            const monkeyId = req.params.monkeyId;
            const days = +req.params.days;
            const result = await this._repo.GetLastTotals(monkeyId, days);
            // console.log('res', result);
            res.send(result);
        });
        server.get('/monkeys', async (req, res) =>
        {
            const result = await this._repo.GetMonkeysSummaries();
            res.send(result);
        });
        server.use('/', express.static(this.ClientDir));

        httpServer.listen(process.env.PORT, () => console.log('MONKEY CHALLENGE SERVER STARTED @ ' + process.env.PORT));

        process.on('SIGINT', () =>
        {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
}
