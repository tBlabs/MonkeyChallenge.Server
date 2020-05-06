import { IDateTimeProvider } from "./DateTimeProvider/DateTimeProvider";

export class HangingDetector
{
    private previousState = 0;
    private previousStateTime: Date = new Date();
    private duration: number = 0;
    isCompleted = false;
    constructor(private _dateTimeProvider: IDateTimeProvider) { }

    public get Duration()
    {
        return this.duration;
    }
    public get IsCompleted()
    {
        return this.isCompleted;
    }
    public Update(state)
    {
        const eventTime: Date = this._dateTimeProvider.Now;
        this.duration = +eventTime - +this.previousStateTime;
        this.isCompleted = (this.previousState === 1) && (state === 0);
        this.previousState = state;
        this.previousStateTime = eventTime;
    }
}
