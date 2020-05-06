"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateTimeProvider_1 = require("./Services/DateTimeProvider/DateTimeProvider");
const HangingDetector_1 = require("./Services/HangingDetector");
const PushupsCounter_1 = require("./Services/PushupsCounter");
const inversify_1 = require("inversify");
let MonkeysFabric = class MonkeysFabric {
    Create(socket) {
        const pushapsCounter = new PushupsCounter_1.PushupsCounter();
        const hangingDetector = new HangingDetector_1.HangingDetector(new DateTimeProvider_1.DateTimeProvider());
        return new Monkey(pushapsCounter, hangingDetector, socket);
    }
};
MonkeysFabric = __decorate([
    inversify_1.injectable()
], MonkeysFabric);
exports.MonkeysFabric = MonkeysFabric;
class Monkey {
    constructor(_pushupsCounter, _hangingDetector, socket) {
        this._pushupsCounter = _pushupsCounter;
        this._hangingDetector = _hangingDetector;
        this.socket = socket;
        const monkeyId = socket.handshake.query.id;
        console.log(`monkey ${monkeyId} connected @ ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`${monkeyId} disconnected`);
        });
        socket.on('update', update => {
            //console.log(monkeyId, update);
            const obj = Object.keys(update);
            const sensor = obj[0];
            const value = update[sensor] ? 0 : 1;
            // Składanie stanu wszystkich małpek (czy to konieczne?)
            //  console.log(monkeyId, sensor, value);
            // webSocketHost.emit('monkey-update', update);
            /*    if (monkeys[monkeyId] == undefined)
                    monkeys[monkeyId] = { Sensors: {}};
    
                monkeys[monkeyId].Sensors[sensor] = value;
    
                webSocketHost.emit('monkeys-update', monkeys);
            */
            if (sensor === "SensorB" && (!_hangingDetector.IsCompleted)) {
                _pushupsCounter.Update(value);
            }
            if (sensor === "SensorA") {
                _hangingDetector.Update(value);
                if (_hangingDetector.IsCompleted) {
                    console.log(`${monkeyId} did ${_pushupsCounter.Count} pushups in ${_hangingDetector.Duration}ms`);
                    _pushupsCounter.Reset();
                    //  AddRecord(duration, pushaps)
                }
            }
        });
    }
}
exports.Monkey = Monkey;
//# sourceMappingURL=Monkey.js.map