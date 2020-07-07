import 'reflect-metadata';
import { IDateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';
import { MonkeyTotalEntity } from "./Entities/MonkeyTotalEntity";
import { MonkeyId } from "./Types/MonkeyId";
import { MonkeyDailyTotalEntity } from "./Entities/MonkeyDailyTotalEntity";
import { SessionEntity } from "./Entities/SessionEntity";
import { injectable, inject } from 'inversify';
import { Types } from '../IoC/Types';
import { Database } from './Database';

@injectable()
export class SessionRepository
{
    constructor(
        private _db: Database,
        @inject(Types.IDateTimeProvider) private _date: IDateTimeProvider)
    { }

    public Init()
    {
        // this.sessionsCollection = this._db.Collection("sessions");
        this.totalsCollection = this._db.Collection("totals");
        this.dailyTotalsCollection = this._db.Collection("dailyTotals");
    }

    // private sessionsCollection;
    private dailyTotalsCollection;
    private totalsCollection;

    private MinusDays(d: Date, days: number): Date
    {
        const date = new Date();
        return new Date(date.setDate(date.getDate() - days));
    }

    public async GetLastTotals(monkeyId: string, days: number): Promise<MonkeyDailyTotalEntity[]>
    {
        const now = this._date.Now;
        const from: Date = this.MinusDays(now, days);
        const totals = await this.GetDailyTotals(monkeyId, { from: from, to: now });
        //   if (totals.length > days) throw new Error(`There should be only one entry per day but was more (${totals.length} where max is ${days}).`)
        return totals;
    }

    private async GetDailyTotals(monkeyId: string, range: { from: Date; to: Date; }): Promise<MonkeyDailyTotalEntity[]>
    {
        range.to.setHours(25);
        range.to.setMinutes(59);
        range.to.setSeconds(59);
        range.to.setMilliseconds(999);
        const query = { MonkeyId: monkeyId, Date: { "$gte": range.from, "$lte": range.to } };

        // console.log('QUERY', JSON.stringify(query));
        let totals: MonkeyDailyTotalEntity[] = await this.dailyTotalsCollection.find(query).toArray();

        return totals.map(x => new MonkeyDailyTotalEntity(monkeyId, x.Date, x.TotalDuration, x.TotalPullups, x.SessionsCount));
    }

    public async GetMonkeyTotal(monkeyId: MonkeyId): Promise<MonkeyTotalEntity>
    {
        const query = { MonkeyId: monkeyId };
        let total: MonkeyTotalEntity = await this.totalsCollection.findOne(query);

        if (total === null) return MonkeyTotalEntity.Empty;

        return total;
    }

    public async Drop()
    {
        try
        {
            // await this.sessionsCollection.drop();
            await this.dailyTotalsCollection.drop();
            await this.totalsCollection.drop();
        }
        catch (error)
        { }
    }

    public async AddSession(id, duration, count)
    {
        const session = new SessionEntity(id, this._date.Now, duration, count);

        try
        {
            // if (0) await this.sessionsCollection.insertOne(session);
            await this.UpdateDailyTotal(session);
            await this.UpdateTotal(session);
        } 
        catch (error)
        {
            console.log('MONGODB ERROR', error);
        }
    }

    private async UpdateTotal(session: SessionEntity): Promise<void>
    {
        const searchObj = { MonkeyId: session.MonkeyId };

        let summary: MonkeyTotalEntity = await this.totalsCollection.findOne(searchObj);
        if (summary == null)
        {
            summary = new MonkeyTotalEntity(session.MonkeyId, session.Duration, session.Pullups, 1);
            await this.totalsCollection.insertOne(summary);
        }
        else 
        {
            summary.TotalDuration += session.Duration;
            summary.TotalPullups += session.Pullups;
            summary.SessionsCount += 1;
            //console.log('T', summary);
            await this.totalsCollection.replaceOne(searchObj, summary);
        }
    }

    private async UpdateDailyTotal(session: SessionEntity)
    {
        session.Date.setHours(2); // Nie mam pojęcia czemu trzeba wpisać 2 żeby w bazie była godzina 00
        session.Date.setMinutes(0);
        session.Date.setSeconds(0);
        session.Date.setMilliseconds(0);

        const searchObj = { MonkeyId: session.MonkeyId, Date: session.Date };

        let total: MonkeyDailyTotalEntity = await this.dailyTotalsCollection.findOne(searchObj);

        if (total == null)
        {
            total = new MonkeyDailyTotalEntity(session.MonkeyId, session.Date, session.Duration, session.Pullups, 1);
            await this.dailyTotalsCollection.insertOne(total);
        }
        else 
        {
            total.TotalDuration += session.Duration;
            total.TotalPullups += session.Pullups;
            total.SessionsCount += 1;
            await this.dailyTotalsCollection.replaceOne(searchObj, total);
        }
    }
}
