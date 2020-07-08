import { injectable } from 'inversify';
import { Database } from './Database';
import { MonkeyEntity } from "./Entities/MonkeyEntity";

@injectable()
export class MonkeysRepo
{
    private usersCollection;

    constructor(private _db: Database)
    { }

    public async Init()
    {
        this.usersCollection = await this._db.Collection("monkeys");
    }

    public async Drop()
    {
        try
        {
            await this.usersCollection.drop();
        }
        catch (error)
        { }
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
