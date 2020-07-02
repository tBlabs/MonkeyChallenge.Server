"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HangingDetector {
    constructor(_dateTimeProvider) {
        this._dateTimeProvider = _dateTimeProvider;
        this.previousState = 0;
        this.previousStateTime = new Date();
        this.duration = 0;
        this.isCompleted = false;
    }
    get Duration() {
        return this.duration;
    }
    get IsCompleted() {
        return this.isCompleted;
    }
    Update(state) {
        const eventTime = this._dateTimeProvider.Now;
        this.duration = +eventTime - +this.previousStateTime;
        this.isCompleted = (this.previousState === 1) && (state === 0);
        this.previousState = state;
        this.previousStateTime = eventTime;
    }
}
exports.HangingDetector = HangingDetector;
//# sourceMappingURL=HangingDetector.js.map