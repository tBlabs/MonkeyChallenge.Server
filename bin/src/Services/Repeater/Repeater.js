"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Repeater {
    static EverySecond(callback) {
        let i = 0;
        setInterval(() => {
            callback(i);
            i++;
        }, 1000);
    }
}
exports.Repeater = Repeater;
//# sourceMappingURL=Repeater.js.map