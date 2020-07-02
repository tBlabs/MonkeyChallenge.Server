"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moq_ts_1 = require("moq.ts");
const HangingDetector_1 = require("../src/Monkey/HangingDetector");
test('HangingDetector should count duration', () => {
    const timeProvider = new moq_ts_1.Mock();
    let i = 0;
    timeProvider
        .setup(x => x.Now)
        .callback(() => [
        new Date(2000, 1, 1, 12, 10, 5),
        new Date(2000, 1, 1, 12, 10, 9),
        new Date(2000, 1, 1, 12, 20, 0),
        new Date(2000, 1, 1, 12, 21, 5),
    ][i++]);
    const hangingDetector = new HangingDetector_1.HangingDetector(timeProvider.object());
    expect(hangingDetector.IsCompleted).toBe(false);
    hangingDetector.Update(1);
    expect(hangingDetector.IsCompleted).toBe(false);
    hangingDetector.Update(0);
    expect(hangingDetector.Duration).toBe(4000);
    expect(hangingDetector.IsCompleted).toBe(true);
    hangingDetector.Update(1);
    expect(hangingDetector.IsCompleted).toBe(false);
    hangingDetector.Update(0);
    expect(hangingDetector.Duration).toBe(65000);
    expect(hangingDetector.IsCompleted).toBe(true);
});
//# sourceMappingURL=HangingDetector.test.js.map