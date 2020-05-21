export type MonkeyId = string;

export class Session
{
    constructor(public MonkeyId: MonkeyId, 
        public Date: string, 
        public Time: string, 
        public Duration: number, 
        public Pushups: number) { }
}

export class Total
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: string, 
        public TotalDuration: number,
        public TotalPushups: number)
    { }
}