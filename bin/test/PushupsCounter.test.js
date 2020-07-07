"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PullupsCounter_1 = require("../src/Monkey/PullupsCounter");
test('PullupsCounter should count pullups', () => {
    const counter = new PullupsCounter_1.PullupsCounter();
    counter.Update(1);
    expect(counter.Count).toBe(0);
    counter.Update(0);
    expect(counter.Count).toBe(1);
    counter.Update(1);
    expect(counter.Count).toBe(1);
    counter.Update(0);
    expect(counter.Count).toBe(2);
    counter.Update(1);
    expect(counter.Count).toBe(2);
    counter.Update(0);
    expect(counter.Count).toBe(3);
});
//# sourceMappingURL=PushupsCounter.test.js.map