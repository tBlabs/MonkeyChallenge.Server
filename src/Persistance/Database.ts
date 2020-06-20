import { MongoClient } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class Database
{
    private client!: MongoClient;
    private db;
    public async Connect()
    {
        try
        {
            const uri = "mongodb://heroku_p0sgdkrk:h0iopgndqjhrochm8qp3crknpn@ds341247.mlab.com:41247/heroku_p0sgdkrk";
            this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await this.client.connect();
            console.log("Connected successfully to database server");
            this.db = this.client.db("heroku_p0sgdkrk");
            return this.db;
        }
        catch (error)
        {
            console.log('DATABASE PROBLEM:', error);
        }
    }
    public Collection(name)
    {
        return this.db.collection(name);
    }
    public Close()
    {
        this.client.close();
    }
}
