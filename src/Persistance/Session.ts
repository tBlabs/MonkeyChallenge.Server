export type MonkeyId = string;

export class Session
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: Date,
        public Duration: number,
        public Pushups: number) 
    { }
}



export class MonkeySummary
{
    constructor(
        public MonkeyId: MonkeyId,
        public TotalDuration: number,
        public TotalPushups: number,
        public SessionsCount: number)
    { }
}


export class MonkeyDay
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: Date,
        public TotalDuration: number,
        public TotalPushups: number,
        public SessionsCount: number
    )
    { }

    public toString() // REMEMBER that this works only for object created by `new`, not taken from database
    {
        return `${this.MonkeyId} did ${this.TotalPushups} pushaps in ${this.TotalDuration} (in ${this.SessionsCount} sessions) @ ${this.Date.toDateString()}`;
    }
}


export class DailySummary
{
    constructor(
        public Date: Date,
        public TotalDuration: number,
        public TotalPushups: number,
        public SessionsCount: number)
    { }

    public toString()
    {
        return `${this.TotalPushups} pushaps in ${this.TotalDuration} (in ${this.SessionsCount} sessions) @ ${this.Date.toDateString()}`;
    }
}