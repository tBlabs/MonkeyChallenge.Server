import 'reflect-metadata';
import { IDateTimeProvider } from "../DateTimeProvider/DateTimeProvider";
import { Types } from "../../IoC/Types";
import { inject, injectable } from "inversify";

@injectable()
export class Recorder
{
    private startMoment!: Date;
    private lastSessionDuration: number = 0;
    private total: number = 0;
    private dailyTotal = {};

    constructor(@inject(Types.IDateTimeProvider) private _dateTimeProvider: IDateTimeProvider)
    { }
    
    public get DailyTotal(): object
    {
        return this.dailyTotal;    
    }
    
    public get LastSessionDuration(): number
    {
        return this.lastSessionDuration;
    }

    public get TotalDuration(): number
    {
        return this.total;
    }

    public Start()
    {
        this.startMoment = this._dateTimeProvider.Now;
    }

    public Stop()
    {
        const now = this._dateTimeProvider.Now; // cause '.New' will always give you different value; and this is a problem during the tests
        this.lastSessionDuration = (now.getTime() - this.startMoment.getTime()) / 1000;

        this.total += this.lastSessionDuration;
        
        const date = this._dateTimeProvider.Date; // always use copy of something that may change with every read
        if (this.dailyTotal[date] === undefined) this.dailyTotal[date] = 0;
        this.dailyTotal[date] += this.lastSessionDuration;
    }
}