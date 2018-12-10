import { injectable } from "inversify";

export interface IDateTimeProvider
{
    Date: string;
    Now: Date;
}

@injectable()
export class DateTimeProvider implements IDateTimeProvider
{
    public get Now(): Date
    {
        return new Date();
    }

    public get Date(): string
    {
        const now = new Date();
        
        return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    }
}