"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MonkeysFactory_1 = require("./Monkey/MonkeysFactory");
const inversify_1 = require("inversify");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");
const Repository_1 = require("./Persistance/Repository");
const MonkeyEntity_1 = require("./Persistance/Entities/MonkeyEntity");
const MonkeysRepo_1 = require("./Persistance/MonkeysRepo");
const Database_1 = require("./Persistance/Database");
const WebClients_1 = require("./WebClients");
const GhostMonkeySocket_1 = require("./GhostMonkeySocket");
let Main = class Main {
    constructor(_db, _usersRepo, _sessionsRepo, _monkeysFactory, _webClients) {
        this._db = _db;
        this._usersRepo = _usersRepo;
        this._sessionsRepo = _sessionsRepo;
        this._monkeysFactory = _monkeysFactory;
        this._webClients = _webClients;
    }
    get ClientDir() {
        const s = __dirname.split(path.sep);
        const dir = [s.slice(0, s.length - 2).join(path.sep), 'client'].join(path.sep);
        console.log('Static files @', dir);
        return dir;
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('start');
            yield this._db.Connect();
            this._usersRepo.Init();
            this._sessionsRepo.Init();
            if (0) {
                yield this._usersRepo.Drop();
                yield this._usersRepo.Add(new MonkeyEntity_1.MonkeyEntity("Monkey2", ["Group1", "Group2"]));
                yield this._usersRepo.Add(new MonkeyEntity_1.MonkeyEntity("GhostMonkey1", ["Group1", "Group3"]));
                yield this._usersRepo.Add(new MonkeyEntity_1.MonkeyEntity("GhostMonkey1", ["Group2", "Group4"]));
                yield this._sessionsRepo.Drop();
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
            webClients.on('connection', (socket) => {
                console.log('web connection @', socket.id);
                this._webClients.Add(socket);
            });
            driverClients.on('connection', (socket) => {
                this._monkeysFactory.Create(socket);
            });
            this._monkeysFactory.Create(new GhostMonkeySocket_1.GhostMonkeySocket("GhostMonkey1", 3000, 600));
            // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey2", 5000, 1000));
            // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey3", 1000, 200));
            server.get('/favicon.ico', (req, res) => res.status(204));
            server.get('/', (req, res) => {
                const msg = `
            <b>/index.html</b> - simple web client; prints monkeys sensors state (only one change at a time)<br><br>
            <b>/group/:groupName</b> - monkeys from a given group<br>
            <b>/:monkeyId/total</b> - returns MonkeySummary of monkey<br>
            <b>/:monkeyId/last/:days</b> - returns last {days} of MonkeyDay`;
                res.send(msg);
            });
            server.get('/ping', (req, res) => res.send('pong'));
            server.get('/:monkeyId/last/:days', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const monkeyId = req.params.monkeyId;
                const days = +req.params.days;
                const result = yield this._sessionsRepo.GetLastTotals(monkeyId, days);
                // console.log('res', result);
                res.send(result);
            }));
            server.get('/:monkeyId/total', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this._sessionsRepo.GetMonkeyTotal(req.params.monkeyId);
                // console.log('Monkey total:', result);
                res.send(result);
            }));
            server.get('/group/:name', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this._usersRepo.GetByGroup(req.params.name);
                res.send(result);
            }));
            server.use('/', express.static(this.ClientDir));
            httpServer.listen(process.env.PORT, () => console.log('MONKEY CHALLENGE SERVER STARTED @ ' + process.env.PORT));
            process.on('SIGINT', () => {
                httpServer.close(() => console.log('SERVER CLOSED'));
            });
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Database_1.Database,
        MonkeysRepo_1.MonkeysRepo,
        Repository_1.SessionRepository,
        MonkeysFactory_1.MonkeysFactory,
        WebClients_1.WebClients])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map