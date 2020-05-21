"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SessionFormer {
    constructor(_pushupsCounter, _hangingDetector) {
        this._pushupsCounter = _pushupsCounter;
        this._hangingDetector = _hangingDetector;
    }
    Form(update, sessionReadyCallback) {
        const obj = Object.keys(update);
        const sensorId = obj[0];
        const value = update[sensorId] ? 0 : 1;
        if (sensorId === "SensorB" && (!this._hangingDetector.IsCompleted)) {
            this._pushupsCounter.Update(value);
        }
        if (sensorId === "SensorA") {
            this._hangingDetector.Update(value);
            if (this._hangingDetector.IsCompleted) {
                sessionReadyCallback(this._hangingDetector.Duration, this._pushupsCounter.Count);
                this._pushupsCounter.Reset();
            }
        }
    }
}
exports.SessionFormer = SessionFormer;
//# sourceMappingURL=SessionFormer.js.map