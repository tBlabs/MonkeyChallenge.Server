import { MonkeyId } from "../Types/MonkeyId";

export class MonkeyDailyTotalEntity
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: Date,
        public TotalDuration: number,
        public TotalPushups: number,
        public SessionsCount: number)
    { }
}
