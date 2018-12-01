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
        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/ping', (req, res) => res.send('pong'));
        server.use(express.static(this.ClientDir));
        socketHost.on('connection', (socket) => {
            console.log('CLIENT CONNECTED', socket.id);
            socket.on('laser', (state) => {
                console.log(state);
                socketHost.emit('state', state);
            });
        });
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