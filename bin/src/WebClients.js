"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let WebClients = class WebClients {
    constructor() {
        this.collection = [];
    }
    Add(socket) {
        socket.on('disconnect', () => {
            console.log('web client disconnected');
        });
        this.collection.push(socket);
    }
    get List() {
        return this.collection;
    }
    SendMonkeyUpdate(monkeyId, data) {
        this.collection.forEach((socket) => {
            socket.emit('update', monkeyId, data);
        });
        // console.log(`Update sent to ${this.collection.length} web clients`);
    }
};
WebClients = __decorate([
    inversify_1.injectable()
], WebClients);
exports.WebClients = WebClients;
//# sourceMappingURL=WebClients.js.map