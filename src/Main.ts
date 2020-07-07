import { MonkeysFactory } from "./Monkey/MonkeysFactory";
import { injectable, inject } from 'inversify';
import { SessionRepository } from './Persistance/SessionRepository';
import { MonkeyEntity } from "./Persistance/Entities/MonkeyEntity";
import { MonkeysRepo } from "./Persistance/MonkeysRepo";
import { Database } from "./Persistance/Database";
import { WebClients } from './Services/WebClients';
import { GhostMonkeySocket } from "./ForTesting/GhostMonkeySocket";
import { HelpBuilder } from "./Services/HelpBuilder";
import { Monkey1Picture, Monkey2Picture } from "./ForTesting/MonkeysPictures";
import { Host } from "./Services/Host";

@injectable()
export class Main
{
    constructor(
        private _host: Host,
        private _db: Database,
        private _usersRepo: MonkeysRepo,
        private _sessionsRepo: SessionRepository,
        private _monkeysFactory: MonkeysFactory,
        private _webClients: WebClients)
    { }

    public async Start(): Promise<void>
    {
        console.log('start');

        await this._db.Init();
        this._usersRepo.Init();
        this._sessionsRepo.Init();

          if (0)
        {
            await this._usersRepo.Drop();
            await this._usersRepo.Add(new MonkeyEntity("Monkey1", [ "Group1", "Group2" ], Monkey1Picture));
            await this._usersRepo.Add(new MonkeyEntity("GhostMonkey1", [ "Group1", "Group3" ], Monkey2Picture));
            await this._usersRepo.Add(new MonkeyEntity("GhostMonkey2", [ "Group2", "Group4" ], Monkey2Picture));
            //  await this._sessionsRepo.Drop();

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

        const webClients = this._host.SocketHost.of('/web');
        const drivers = this._host.SocketHost.of('/monkey');

        webClients.on('connection', (socket) =>
        {
            console.log('web connection @', socket.id);

            this._webClients.Add(socket);
        });

        drivers.on('connection', (socket) =>
        {
            this._monkeysFactory.Create(socket);
        });

        // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey1", 3000, 600));
        // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey2", 5000, 1000));
        // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey3", 1000, 200));

        this._host.OnGet('/', (req, res) =>
        {
            const hb = new HelpBuilder("MonkeyChallenge.Server")
                .Status("Drivers connected", () => this._monkeysFactory.Count.toString() + " (" + (this._monkeysFactory.MonkeysIds.length > 0 ? this._monkeysFactory.MonkeysIds : "none") + ")")
                .Status("Web clients connected", () => this._webClients.List.length.toString())
                .Config("Static files", this._host.ClientDir, "app dir", "C:\\Projects\\App\\client", "code")
                .Api("/public/index.html", "Simple web client; prints monkeys sensors state (only one change at a time)")
                .Api("/group/:name", "Get monkeys from a given group")
                .Api("/:monkeyId/total", "Returns MonkeySummary of monkey")
                .Api("/:monkeyId/last/:days", "Returns last {days} of MonkeyDay");

            res.send(hb.ToString());
        });

        this._host.OnGet('/:monkeyId/last/:days', async (req, res) =>
        {
            const monkeyId = req.params.monkeyId;
            const days = +req.params.days;
            const result = await this._sessionsRepo.GetLastTotals(monkeyId, days);
            // console.log('res', result);
            res.send(result);
        });

        this._host.OnGet('/:monkeyId/total', async (req, res) =>
        {
            const result = await this._sessionsRepo.GetMonkeyTotal(req.params.monkeyId);
            // console.log('Monkey total:', result);
            res.send(result);
        });

        this._host.OnGet('/group/:name', async (req, res) =>
        {
            const result = await this._usersRepo.GetByGroup(req.params.name);
            res.send(result);
        });

        this._host.Start();
    }
}
