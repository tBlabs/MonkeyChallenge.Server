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
const WebClients_1 = require("../Services/WebClients");
const DateTimeProvider_1 = require("../Services/DateTimeProvider/DateTimeProvider");
const PullupsCounter_1 = require("./PullupsCounter");
const inversify_1 = require("inversify");
const Repository_1 = require("../Persistance/Repository");
const SessionFormer_1 = require("./SessionFormer");
const Monkey_1 = require("./Monkey");
const HangingDetector_1 = require("./HangingDetector");
const Types_1 = require("../IoC/Types");
let MonkeysFactory = class MonkeysFactory {
    constructor(_repo, _web, _date) {
        this._repo = _repo;
        this._web = _web;
        this._date = _date;
        this.monkeysIds = [];
    }
    Create(socket) {
        const pullupsCounter = new PullupsCounter_1.PullupsCounter();
        const hangingDetector = new HangingDetector_1.HangingDetector(new DateTimeProvider_1.DateTimeProvider());
        const sessionFormer = new SessionFormer_1.SessionFormer(pullupsCounter, hangingDetector);
        const monkeyId = socket.handshake.query.id;
        this.monkeysIds.push(monkeyId);
        socket.on('disconnect', () => {
            console.log(`${monkeyId} disconnected`);
            const mInd = this.MonkeysIds.indexOf(monkeyId);
            this.monkeysIds.splice(mInd, 1);
        });
        new Monkey_1.Monkey(socket, this._repo, this._web, sessionFormer);
    }
    get MonkeysIds() {
        return this.monkeysIds.join();
    }
    get Count() {
        return this.monkeysIds.length;
    }
};
MonkeysFactory = __decorate([
    inversify_1.injectable(),
    __param(2, inversify_1.inject(Types_1.Types.IDateTimeProvider)),
    __metadata("design:paramtypes", [Repository_1.SessionRepository,
        WebClients_1.WebClients,
        DateTimeProvider_1.DateTimeProvider])
], MonkeysFactory);
exports.MonkeysFactory = MonkeysFactory;
//# sourceMappingURL=MonkeysFactory.js.map