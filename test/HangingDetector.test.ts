import { Mock } from "moq.ts";
import { IDateTimeProvider } from "../src/Services/DateTimeProvider/DateTimeProvider";
import { HangingDetector } from "../src/Services/HangingDetector";

test('HangingDetector should count duration', () =>
{
    const timeProvider = new Mock<IDateTimeProvider>();
    let i = 0;
    timeProvider
        .setup(x => x.Now)
        .callback(() => [
            new Date(2000, 1, 1, 12, 10, 5), 
            new Date(2000, 1, 1, 12, 10, 9),
            new Date(2000, 1, 1, 12, 20, 0),
            new Date(2000, 1, 1, 12, 21, 5),
        ][i++]);

    const hangingDetector = new HangingDetector(timeProvider.object());

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


