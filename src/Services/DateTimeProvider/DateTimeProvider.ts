import { injectable } from "inversify";

export interface IDateTimeProvider
{
    DateAsString: string;
    TimeAsString: string;
    Now: Date;
}

@injectable()
export class DateTimeProvider implements IDateTimeProvider
{
    public get Now(): Date
    {
        return new Date();
    }

    public get DateAsString(): string
    {
        const now = new Date();
        
        return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    }

    public get TimeAsString(): string
    {
        const now = new Date();
        
        return `${now.getHours()}:${now.getMinutes().toFixed(0).padStart(2, "0")}:${now.getSeconds().toFixed(0).padStart(2, "0")}`;
    }

    public get DateTimeAsString(): string
    {
        const now = new Date();
        
        return `${this.DateAsString} ${this.TimeAsString}`;
    }
}