import { DateTimeProvider, IDateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';
import { MongoClient } from 'mongodb';
import { Session, MonkeyDay, MonkeyId, DailySummary, MonkeySummary } from './Session';
import { injectable, inject } from 'inversify';
import { Types } from '../IoC/Types';

@injectable()
export class SessionRepository
{

    private MinusDays(d: Date, days: number): Date
    {
        const date = new Date();
        return new Date(date.setDate(date.getDate() - days));
    }
    public async GetLastTotals(monkeyId: string, days: number): Promise<DailySummary[]>
    {
        const now = this._date.Now;
        const from: Date  = this.MinusDays(now, days);
        const totals = await this.GetTotals(monkeyId, { from: from, to: now });
        if (totals.length > days) throw new Error(`There should be only one entry per day but was more (${totals.length} where max is ${days}).`)
        return totals;
    }
    public async GetTotals(monkeyId: string, range: { from: Date; to: Date; }): Promise<DailySummary[]>
    {
        range.to.setHours(25);
        range.to.setMinutes(59);
        range.to.setSeconds(59);
        range.to.setMilliseconds(999);
        const query = { MonkeyId: monkeyId, Date: { "$gte": range.from, "$lte": range.to } };

        // console.log('QUERY', JSON.stringify(query));
        let totals: MonkeyDay[] = await this.totalsCollection.find(query).toArray();
        return totals.map(x=>new DailySummary(x.Date, x.SessionsCount, x.TotalPushups, x.SessionsCount));
    }

    constructor(@inject(Types.IDateTimeProvider) private _date: IDateTimeProvider)
    { }
    private client!: MongoClient;
    private db;
    private sessionsCollection;
    private totalsCollection;
    private summariesCollection;
    public async Drop()
    {
        try
        {
            await this.sessionsCollection.drop();
            await this.totalsCollection.drop();
            await this.summariesCollection.drop();
        } 
        catch (error)
        { }
    }
    public async Connect()
    {
        try
        {
            const uri = "mongodb://heroku_p0sgdkrk:h0iopgndqjhrochm8qp3crknpn@ds341247.mlab.com:41247/heroku_p0sgdkrk";
            this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await this.client.connect();
            console.log("Connected successfully to database server");
            this.db = this.client.db("heroku_p0sgdkrk");

            this.sessionsCollection = this.db.collection("sessions");
            this.totalsCollection = this.db.collection("totals");
            this.summariesCollection = this.db.collection("summaries");
        }
        catch (error)
        {
            console.log('DATABASE PROBLEM:', error);
        }
    }

    public Close()
    {
        this.client.close();
    }

    public async AddSession(session: Session)
    {
        await this.sessionsCollection.insertOne(session);
        await this.UpdateTotal(session);
        await this.UpdateSummary(session);
    }
    private async UpdateSummary(session: Session): Promise<void>
    {
        const searchObj = { MonkeyId: session.MonkeyId };

        let summary: MonkeySummary = await this.summariesCollection.findOne(searchObj);

        if (summary == null)
        {
            summary = new MonkeySummary(session.MonkeyId, session.Duration, session.Pushups, 1);
            await this.summariesCollection.insertOne(summary);
        }
        else 
        {
            summary.TotalDuration += session.Duration;
            summary.TotalPushups += session.Pushups;
            summary.SessionsCount += 1;
            await this.summariesCollection.replaceOne(searchObj, summary);
        }
    }

    private async UpdateTotal(session: Session)
    {
        session.Date.setHours(2); // Nie mam pojęcia czemu trzeba wpisać 2 żeby w bazie była godzina 00
        session.Date.setMinutes(0);
        session.Date.setSeconds(0);
        session.Date.setMilliseconds(0);

        const searchObj = { MonkeyId: session.MonkeyId, Date: session.Date };

        let total: MonkeyDay = await this.totalsCollection.findOne(searchObj);

        if (total == null)
        {
            total = new MonkeyDay(session.MonkeyId, session.Date, session.Duration, session.Pushups, 1);
            await this.totalsCollection.insertOne(total);
        }
        else 
        {
            total.TotalDuration += session.Duration;
            total.TotalPushups += session.Pushups;
            total.SessionsCount += 1;
            await this.totalsCollection.replaceOne(searchObj, total);
        }
    }
}
