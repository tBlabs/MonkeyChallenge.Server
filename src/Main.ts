import { MonkeysFactory } from "./Monkey/MonkeysFactory";
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as cors from 'cors';
import { SessionRepository } from './Persistance/Repository';
import { MonkeyEntity } from "./Persistance/Entities/MonkeyEntity";
import { MonkeysRepo } from "./Persistance/MonkeysRepo";
import { Database } from "./Persistance/Database";
import { WebClients } from './WebClients';
import { GhostMonkeySocket } from "./GhostMonkeySocket";

@injectable()
export class Main
{
    constructor(
        private _db: Database,
        private _usersRepo: MonkeysRepo,
        private _sessionsRepo: SessionRepository,
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

        await this._db.Connect();
        this._usersRepo.Init();
        this._sessionsRepo.Init();

          if (0)
        {
            await this._usersRepo.Drop();
            await this._usersRepo.Add(new MonkeyEntity("Monkey2", ["Group1", "Group2"]));
            await this._usersRepo.Add(new MonkeyEntity("GhostMonkey1", ["Group1", "Group3"]));
            await this._usersRepo.Add(new MonkeyEntity("GhostMonkey1", ["Group2", "Group4"]));
            await this._sessionsRepo.Drop();

            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 0, 1, 12, 0, 1), 5000, 1));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 0, 1, 12, 0, 1), 5000, 1));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 0, 1, 12, 10, 2), 5000, 1));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 1, 1, 13, 0, 3), 5000, 2));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 1, 1, 12, 10, 0), 5000, 2));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 1, 2, 10, 0, 0), 5000, 3));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(2020, 1, 2, 10, 10, 0), 5000, 3));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(), 5000, 3));
            // await this._sessionsRepo.AddSession(new Session("TestMonkey", new Date(), 5000, 3));

            // let r: DailySummary[] = [];
            // r = await this._sessionsRepo.GetLastTotals("TestMonkey", 7);
            // console.log('rrrrrrrr', r.map(x => JSON.stringify(x)));
            //return
        }


        const server = express();
        server.use(cors());
        const httpServer = http.createServer(server);
        const socketHost = socketIo(httpServer);
        const webClients = socketHost.of('/web');
        const driverClients = socketHost.of('/monkey');


        webClients.on('connection', (socket) =>
        {
            console.log('web connection @', socket.id);

            this._webClients.Add(socket);
        });

        driverClients.on('connection', (socket) =>
        {
            this._monkeysFactory.Create(socket);
        });

        this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey1", 3000, 600));
        // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey2", 5000, 1000));
        // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey3", 1000, 200));

        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/', (req, res) =>
        {
            const msg = `
            <b>/index.html</b> - simple web client; prints monkeys sensors state (only one change at a time)<br><br>
            <b>/group/:groupName</b> - monkeys from a given group<br>
            <b>/:monkeyId/total</b> - returns MonkeySummary of monkey<br>
            <b>/:monkeyId/last/:days</b> - returns last {days} of MonkeyDay`;
            res.send(msg);
        });
        server.get('/ping', (req, res) => res.send('pong'));
        server.get('/:monkeyId/last/:days', async (req, res) =>
        {
            const monkeyId = req.params.monkeyId;
            const days = +req.params.days;
            const result = await this._sessionsRepo.GetLastTotals(monkeyId, days);
            // console.log('res', result);
            res.send(result);
        });
        server.get('/:monkeyId/total', async (req, res) =>
        {
            const result = await this._sessionsRepo.GetMonkeyTotal(req.params.monkeyId);
            // console.log('Monkey total:', result);
            res.send(result);
        });
        server.get('/group/:name', async (req, res) =>
        {
            const result = await this._usersRepo.GetByGroup(req.params.name);
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
