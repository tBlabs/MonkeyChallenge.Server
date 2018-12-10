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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Types_1 = require("./IoC/Types");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
// @injectable()
// export class WebClients
// {
//     private collection: Socket[] = [];
//     public Add(socket: Socket)
//     {
//         this.collection.push(socket);
//     }
//     public get List()
//     {
//         return this.collection;
//     }
//     public SendMonkeyUpdate()
//     {
//     }
// }
// export class Monkey
// {
//     constructor(
//         public socket: Socket,
//         public id: string)
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
    constructor(_args, _runMode) {
        this._args = _args;
        this._runMode = _runMode;
    }
    get ClientDir() {
        const s = __dirname.split(path.sep); // __dirname returns '/home/tb/projects/EventsManager/bin'. We don't wanna 'bin'...
        return s.slice(0, s.length - 1).join(path.sep) + '/client';
    }
    async Start() {
        const server = express();
        const httpServer = http.createServer(server);
        const socketHost = socketIo(httpServer);
        const webSocketHost = socketHost.of('/web');
        const monkeySocketHost = socketHost.of('/monkey');
        webSocketHost.on('connection', (socket) => {
            console.log('web', socket.id);
        });
        monkeySocketHost.on('connection', (socket) => {
            const monkeyId = socket.handshake.query.id;
            console.log('monkey', socket.id, monkeyId);
            socket.on('monkey-update', update => {
                //  console.log(update);
                webSocketHost.emit('monkey-update', update);
            });
        });
        let guard = 0;
        let state = 0;
        setInterval(() => {
            state = 1 - state;
            webSocketHost.emit('monkey-update', { id: "GhostMonkey", state: state, timestamp: +new Date(), guard: guard++ });
        }, 1000);
        server.get('/favicon.ico', (req, res) => res.status(204));
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
        const port = this._runMode.IsDev ? 4000 : process.env.PORT;
        httpServer.listen(port, () => console.log('SERVER STARTED @ ' + port));
        process.on('SIGINT', () => {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IStartupArgs)),
    __param(1, inversify_1.inject(Types_1.Types.IRunMode)),
    __metadata("design:paramtypes", [Object, Object])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map