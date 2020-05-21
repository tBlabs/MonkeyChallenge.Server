import { IDateTimeProvider } from "../Services/DateTimeProvider/DateTimeProvider";

export class HangingDetector
{
    private previousState = 0;
    private previousStateTime: Date = new Date();
    private duration: number = 0;
    private isCompleted = false;

    constructor(private _dateTimeProvider: IDateTimeProvider) 
    { }

    public get Duration()
    {
        return this.duration;
    }

    public get IsCompleted()
    {
        return this.isCompleted;
    }

    public Update(state: number)
    {
        const eventTime: Date = this._dateTimeProvider.Now;
        this.duration = +eventTime - +this.previousStateTime;
        this.isCompleted = (this.previousState === 1) && (state === 0);
        this.previousState = state;
        this.previousStateTime = eventTime;
    }
}
