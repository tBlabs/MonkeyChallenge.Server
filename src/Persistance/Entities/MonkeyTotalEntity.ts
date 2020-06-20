import { MonkeyId } from "../Types/MonkeyId";

export class MonkeyTotalEntity
{
    constructor(
        public MonkeyId: MonkeyId,
        public TotalDuration: number,
        public TotalPushups: number,
        public SessionsCount: number)
    { }

    public static get Empty()
    {
        return  new MonkeyTotalEntity("No Total entry for queried monkey", 0, 0, 0);
    }

}
