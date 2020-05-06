"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PushupsCounter {
    constructor() {
        this.count = 0;
        this.previousState = 0;
    }
    get Count() {
        return this.count;
    }
    Reset() {
        this.count = 0;
    }
    Update(state) {
        if ((state === 0) && (this.previousState === 1)) {
            this.count++;
        }
        this.previousState = state;
    }
}
exports.PushupsCounter = PushupsCounter;
//# sourceMappingURL=PushupsCounter.js.map