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
const Monkey_1 = require("./Monkey");
const inversify_1 = require("inversify");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
// export class Monkey
// {
//     constructor(
//         public Id: string,
//         public Sensors: any //SensorState[],
//         )
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
let Main = class Main {
    constructor(
    // @inject(Types.IStartupArgs) private _args: IStartupArgs,
    // @inject(Types.IRunMode) private _runMode: IRunMode,
    _monkeysFabric) {
        this._monkeysFabric = _monkeysFabric;
    }
    get ClientDir() {
        const s = __dirname.split(path.sep); // __dirname returns '/home/tb/projects/EventsManager/bin'. We don't wanna 'bin'...
        return s.slice(0, s.length - 1).join(path.sep) + '/client';
    }
    async Start() {
        console.log('start');
        // const repo = new Repository();
        // await repo.Connect();
        // return;
        const server = express();
        const httpServer = http.createServer(server);
        const socketHost = socketIo(httpServer);
        const webSocketHost = socketHost.of('/web');
        const monkeySocketHost = socketHost.of('/monkey');
        // const monkeys = {};
        webSocketHost.on('connection', (socket) => {
            console.log('web', socket.id);
        });
        monkeySocketHost.on('connection', (socket) => {
            // new Monkey(socket);
            this._monkeysFabric.Create(socket);
        });
        let guard = 0;
        let state = 0;
        setInterval(() => {
            state = 1 - state;
            webSocketHost.emit('monkey-update', { id: "GhostMonkey", state: state, timestamp: +new Date(), guard: guard++ });
        }, 1000);
        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/', (req, res) => res.send('Please go to /index.html'));
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
        const port = process.env.PORT;
        httpServer.listen(port, () => console.log('SERVER STARTED @ ' + port));
        process.on('SIGINT', () => {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Monkey_1.MonkeysFabric])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map