import { DateTimeProvider, IDateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';
import { MongoClient } from 'mongodb';
import { Session, Total } from './Session';
import { injectable, inject } from 'inversify';
import { Types } from '../IoC/Types';

@injectable()
export class SessionRepository
{
    constructor(@inject(Types.IDateTimeProvider) private _date: IDateTimeProvider)
    { }
    private client!: MongoClient;
    private db;
    private sessionsCollection;
    private totalsCollection;

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

        }
        catch (error)
        {
            console.log('DB PROBLEM', error);
        }
    }

    public Close()
    {
        this.client.close();
    }

    public async Get()
    {
        const result = await this.sessionsCollection.find({}).toArray();

        console.log('RRR', result);
    }

    public async AddSession(session: Session)
    {
        this.sessionsCollection.insertOne(session);

        await this.UpdateTotal(session);
    }

    private async UpdateTotal(session: Session)
    {
        const searchObj = { MonkeyId: session.MonkeyId, Date: session.Date }; 
        // console.log('sssss',  searchObj);
        // let total: Total = (await this.totalsCollection.find(searchObj).toArray())[0];
        let total: Total = await this.totalsCollection.findOne(searchObj);
        // console.log('ttt', total);
        if (total == null)
        {
            total = new Total(session.MonkeyId, session.Date, session.Duration, session.Pushups);
            this.totalsCollection.insertOne(total);
            // console.log('inserted', total); 
        } 
        else 
        {
            total.TotalDuration += session.Duration;
            total.TotalPushups += session.Pushups;
            this.totalsCollection.replaceOne(searchObj, total);
            // console.log('updated', total);  
        }
    } 
} 
 