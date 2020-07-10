import { MonkeyId } from "../Types/MonkeyId";
import { DateOnly } from "../../Types/DateOnly";

export class MonkeyDailyTotalEntity
{
    constructor(
        public MonkeyId: MonkeyId,
        public Date: DateOnly,
        public TotalDuration: number,
        public TotalPullups: number,
        public SessionsCount: number)
    { }
}
