import { PushupsCounter } from "../src/Monkey/PushupsCounter";

test('PushupsCounter should count pushaps', () =>
{
    const counter = new PushupsCounter();

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