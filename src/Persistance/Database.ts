import { MongoClient } from 'mongodb';
import { injectable, inject } from 'inversify';
import { Types } from '../IoC/Types';
import { IDatabaseConnectionStringProvider } from './IDatabaseConnectionStringProvider';

@injectable()
export class Database
{
    private client!: MongoClient;
    private db;

    constructor(
        @inject(Types.IDatabaseConnectionStringProvider) private _connectionStringProvider: IDatabaseConnectionStringProvider)
    { }

    public async Init()
    {
        try
        {
            const uri = this._connectionStringProvider.ConnectionString;
            this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await this.client.connect();
            console.log("Successfully connected to database " + this._connectionStringProvider.DatabaseName);
            this.db = this.client.db(this._connectionStringProvider.DatabaseName);
            // console.log('DDDDDDDDDDDDDDDDD', this.db);
            return this.db;
        }
        catch (error)
        {
            console.log('DATABASE PROBLEM:', error);
        }
    }

    public async Collection(name)
    {
        // if (await this.db.collection(name) === undefined)
        // {
        //     console.log('Creating ', name);
        //     await this.db.createCollection(name);
        // }
        try {
            
            return await this.db.collection(name);
        } catch (error) {
            console.log('EEEEEEEEEEEEEEEee',error);
        }

    }

    public Close()
    {
        this.client.close();
    }
}
