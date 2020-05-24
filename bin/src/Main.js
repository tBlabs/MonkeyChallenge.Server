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
const Repository_1 = require("./Persistance/Repository");
const WebClients_1 = require("./WebClients");
const Session_1 = require("./Persistance/Session");
const GhostMonkeySocket_1 = require("./GhostMonkeySocket");
let Main = class Main {
    constructor(_repo, _monkeysFactory, _webClients) {
        this._repo = _repo;
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
            yield this._repo.Connect();
            // await this._repo.Drop();
            if (0) {
                yield this._repo.Drop();
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 0, 1, 12, 0, 1), 5000, 1));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 0, 1, 12, 0, 1), 5000, 1));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 0, 1, 12, 10, 2), 5000, 1));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 1, 1, 13, 0, 3), 5000, 2));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 1, 1, 12, 10, 0), 5000, 2));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 1, 2, 10, 0, 0), 5000, 3));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(2020, 1, 2, 10, 10, 0), 5000, 3));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(), 5000, 3));
                yield this._repo.AddSession(new Session_1.Session("TestMonkey", new Date(), 5000, 3));
                let r = [];
                r = yield this._repo.GetLastTotals("TestMonkey", 7);
                console.log('rrrrrrrr', r.map(x => JSON.stringify(x)));
                return;
            }
            const server = express();
            const httpServer = http.createServer(server);
            const socketHost = socketIo(httpServer);
            const webSocketHost = socketHost.of('/web');
            const monkeySocketHost = socketHost.of('/monkey');
            webSocketHost.on('connection', (socket) => {
                console.log('web connection @', socket.id);
                this._webClients.Add(socket);
            });
            monkeySocketHost.on('connection', (socket) => {
                this._monkeysFactory.Create(socket);
            });
            this._monkeysFactory.Create(new GhostMonkeySocket_1.GhostMonkeySocket("GhostMonkey1", 3000, 700));
            this._monkeysFactory.Create(new GhostMonkeySocket_1.GhostMonkeySocket("GhostMonkey2", 8000, 1200));
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
            server.get('/last/:days/for/:monkeyId', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const monkeyId = req.params.monkeyId;
                const days = +req.params.days;
                const result = yield this._repo.GetLastTotals(monkeyId, days);
                // console.log('res', result);
                res.send(result);
            }));
            server.get('/monkeys', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this._repo.GetMonkeysSummaries();
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
    __metadata("design:paramtypes", [Repository_1.SessionRepository,
        MonkeysFactory_1.MonkeysFactory,
        WebClients_1.WebClients])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map