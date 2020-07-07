import { PullupsCounter } from "../src/Monkey/PullupsCounter";

test('PullupsCounter should count pullups', () =>
{
    const counter = new PullupsCounter();

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