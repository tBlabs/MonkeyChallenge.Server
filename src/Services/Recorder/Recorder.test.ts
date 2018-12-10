import { Recorder } from "./Recorder";
import { Mock, MockBehavior } from 'moq.ts';
import { IDateTimeProvider } from "../DateTimeProvider/DateTimeProvider";

test(`should compute last session duration`, () =>
{
    const _dateTimeProviderMock = new Mock<IDateTimeProvider>();
    let v = 0;
    const values = [new Date(100 * 1000), new Date(105 * 1000)];
    _dateTimeProviderMock
        .setup(x => x.Now)
        .callback(() => values[v++]);

    const recorder = new Recorder(_dateTimeProviderMock.object());

    recorder.Start()
    recorder.Stop();

    expect(recorder.LastSessionDuration).toBe(5);
});

test(`should count total duration for few start/stop sessions`, () =>
{
    const _dateTimeProviderMock = new Mock<IDateTimeProvider>();
    let v = 0;
    const values = [new Date(100 * 1000), new Date(105 * 1000), new Date(210 * 1000), new Date(250 * 1000)];
    _dateTimeProviderMock
        .setup(x => x.Now)
        .callback(() => values[v++]);

    const recorder = new Recorder(_dateTimeProviderMock.object());

    recorder.Start()
    recorder.Stop();
    recorder.Start()
    recorder.Stop();

    expect(recorder.TotalDuration).toBe(45);
});

test(`daily total should be counted`, () =>
{
    const _dateTimeProviderMock = new Mock<IDateTimeProvider>();
    let v = 0;
    const values = [
        new Date(2000, 1, 1, 12, 0, 0),
        new Date(2000, 1, 1, 12, 1, 0),
        new Date(2000, 1, 1, 13, 1, 0),
        new Date(2000, 1, 1, 13, 1, 5),
        new Date(2000, 1, 2, 12, 0, 0),
        new Date(2000, 1, 2, 12, 2, 0),
    ];
    _dateTimeProviderMock
        .setup(x => x.Now)
        .callback(() => values[v++]);

    let d = 0;
    const dates = ["2000-1-1", "2000-1-1", "2000-1-2"];
    _dateTimeProviderMock
        .setup(x=>x.Date)
        .callback(()=> dates[d++]);

    const recorder = new Recorder(_dateTimeProviderMock.object());

    recorder.Start();
    recorder.Stop();
    recorder.Start();
    recorder.Stop();
    recorder.Start();
    recorder.Stop();

    expect(recorder.DailyTotal["2000-1-1"]).toBe(65);
    expect(recorder.DailyTotal["2000-1-2"]).toBe(120);
});