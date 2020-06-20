import { injectable } from 'inversify';
import { Database } from './Database';
import { MonkeyEntity } from "./Entities/MonkeyEntity";

@injectable()
export class MonkeysRepo
{
    public async Drop()
    {
        try
        {
            await this.usersCollection.drop();
        }
        catch (error)
        { }
    }
    private usersCollection;

    constructor(private _db: Database) 
    { }

    public Init()
    {
        this.usersCollection = this._db.Collection("monkeys");
    }

    public async GetByGroup(groupName: string): Promise<MonkeyEntity[]>
    {
        return await this.usersCollection.find({ GroupsNames: groupName }).toArray();
    }
    
    public async Add(monkey: MonkeyEntity)
    {
        await this.usersCollection.insertOne(monkey);
    }
}
