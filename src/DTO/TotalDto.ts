import { DateOnly } from "../Types/DateOnly";

export class TotalDto
{
    constructor(
        public Date: DateOnly,
        public Duration: number,
        public Pullups: number,
        public Sessions: number) { }
}
