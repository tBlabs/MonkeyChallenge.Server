"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PushupsCounter_1 = require("../src/Services/PushupsCounter");
test('PushupsCounter should count pushaps', () => {
    const counter = new PushupsCounter_1.PushupsCounter();
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