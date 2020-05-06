import { MongoClient } from 'mongodb';

export class Repository
{
    public async Connect()
    {
        try
        {

            const uri = "mongodb://heroku_p0sgdkrk:h0iopgndqjhrochm8qp3crknpn@ds341247.mlab.com:41247/heroku_p0sgdkrk";
            const client = new MongoClient(uri, { useNewUrlParser: true });
            await client.connect();
            console.log("Connected successfully to server");
            const db = client.db("heroku_p0sgdkrk");
          
            const collection = db.collection("sample");

            const r = await collection.find({}).toArray();

            console.log('RRR', r);
            client.close();
        } 
        catch (error)
        {
            console.log('DB PROBLEM', error);
        }
    }
}