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
const WebClients_1 = require("./WebClients");
const DateTimeProvider_1 = require("./Services/DateTimeProvider/DateTimeProvider");
const HangingDetector_1 = require("./Services/HangingDetector");
const PushupsCounter_1 = require("./Services/PushupsCounter");
const inversify_1 = require("inversify");
const Repository_1 = require("./Persistance/Repository");
const SessionFormer_1 = require("./SessionFormer");
const Monkey_1 = require("./Monkey");
let MonkeysFactory = class MonkeysFactory {
    constructor(_repo, _web) {
        this._repo = _repo;
        this._web = _web;
    }
    Create(socket) {
        const pushapsCounter = new PushupsCounter_1.PushupsCounter();
        const hangingDetector = new HangingDetector_1.HangingDetector(new DateTimeProvider_1.DateTimeProvider());
        const sessionFormer = new SessionFormer_1.SessionFormer(pushapsCounter, hangingDetector);
        return new Monkey_1.Monkey(this._repo, this._web, sessionFormer, socket);
    }
};
MonkeysFactory = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Repository_1.Repository, WebClients_1.WebClients])
], MonkeysFactory);
exports.MonkeysFactory = MonkeysFactory;
//# sourceMappingURL=MonkeysFactory.js.map