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
