import { MonkeyId } from "../Types/MonkeyId";

export class SessionEntity
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: Date,
        public Duration: number,
        public Pullups: number)
    { }
}

class Session
{
    public Duration;
    public Pullups;
}

class SessionsSum
{
    public Duration;
    public Pullups;
    public Count;
}