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
const Types_1 = require("./../../IoC/Types");
let RunMode = class RunMode {
    constructor(_env) {
        this._env = _env;
        this.MODE_KEY = 'MODE';
    }
    get Current() {
        return this._env.ValueOrDefault(this.MODE_KEY, 'unset');
    }
    get IsDev() {
        return (this._env.ValueOf(this.MODE_KEY) === 'dev');
    }
    get IsProd() {
        return (this._env.ValueOf(this.MODE_KEY) === 'prod');
    }
};
RunMode = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IEnvironment)),
    __metadata("design:paramtypes", [Object])
], RunMode);
exports.RunMode = RunMode;
//# sourceMappingURL=RunMode.js.map