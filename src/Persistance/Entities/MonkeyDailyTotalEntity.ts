import { MonkeyId } from "../Types/MonkeyId";

export class MonkeyDailyTotalEntity
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: Date,
        public TotalDuration: number,
        public TotalPullups: number,
        public SessionsCount: number)
    { }
}
