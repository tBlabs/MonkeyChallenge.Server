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
require("reflect-metadata");
const Types_1 = require("../../IoC/Types");
const inversify_1 = require("inversify");
let Recorder = class Recorder {
    constructor(_dateTimeProvider) {
        this._dateTimeProvider = _dateTimeProvider;
        this.startMoment = !;
        this.lastSessionDuration = 0;
        this.total = 0;
        this.dailyTotal = {};
    }
    get DailyTotal() {
        return this.dailyTotal;
    }
    get LastSessionDuration() {
        return this.lastSessionDuration;
    }
    get TotalDuration() {
        return this.total;
    }
    Start() {
        this.startMoment = this._dateTimeProvider.Now;
    }
    Stop() {
        const now = this._dateTimeProvider.Now; // cause '.New' will always give you different value; and this is a problem during the tests
        this.lastSessionDuration = (now.getTime() - this.startMoment.getTime()) / 1000;
        this.total += this.lastSessionDuration;
        const date = this._dateTimeProvider.Date; // always use copy of something that may change with every read
        if (this.dailyTotal[date] === undefined)
            this.dailyTotal[date] = 0;
        this.dailyTotal[date] += this.lastSessionDuration;
    }
};
Recorder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IDateTimeProvider)),
    __metadata("design:paramtypes", [Object])
], Recorder);
exports.Recorder = Recorder;
//# sourceMappingURL=Recorder.js.map