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
Object.defineProperty(exports, "__esModule", { value: true });
const MonkeysFactory_1 = require("./Monkey/MonkeysFactory");
const inversify_1 = require("inversify");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const Repository_1 = require("./Persistance/Repository");
const WebClients_1 = require("./WebClients");
class GhostMonkeySocket {
    constructor() {
        this.id = "FakeSocketId";
        this.handshake = { query: { id: "GhostMonkey3" } };
    }
    on(event, callback) {
        if (event === 'update') {
            let x = 0;
            setInterval(() => {
                x = 1 - x;
                callback({ SensorA: x });
            }, 3000);
            let p = 0;
            setInterval(() => {
                p = 1 - p;
                callback({ SensorB: p });
            }, 700);
        }
    }
}
let Main = class Main {
    constructor(_repo, _monkeysFactory, _webClients) {
        this._repo = _repo;
        this._monkeysFactory = _monkeysFactory;
        this._webClients = _webClients;
    }
    get ClientDir() {
        console.log(__dirname);
        console.log(path.sep);
        const s = __dirname.split(path.sep); // __dirname returns '/home/tb/projects/EventsManager/bin'. We don't wanna 'bin'...
        console.log(s);
        const dir = [s.slice(0, s.length - 2).join(path.sep), 'client'].join(path.sep);
        // const dir = "C:\\PrivProjects\\monkey-challenge-server\\client";
        // const dir = __dirname;
        console.log('Static files dir:', dir);
        return dir;
    }
    async Start() {
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
        webSocketHost.on('connection', (socket) => {
            console.log('web connection @', socket.id);
            this._webClients.Add(socket);
        });
        monkeySocketHost.on('connection', (socket) => {
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
        process.on('SIGINT', () => {
            httpServer.close(() => console.log('SERVER CLOSED'));
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