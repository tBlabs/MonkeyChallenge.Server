import { MonkeyId } from "../Types/MonkeyId";

export class MonkeyTotalEntity
{
    constructor(
        public MonkeyId: MonkeyId,
        public TotalDuration: number,
        public TotalPullups: number,
        public SessionsCount: number)
    { }

    public static get Empty()
    {
        return  new MonkeyTotalEntity("Empty MonkeyTotal entry", 0, 0, 0);
    }
}
