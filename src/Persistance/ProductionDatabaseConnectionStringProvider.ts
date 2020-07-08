import { injectable } from 'inversify';
import { IDatabaseConnectionStringProvider } from './IDatabaseConnectionStringProvider';

@injectable()
export class ProductionDatabaseConnectionStringProvider implements IDatabaseConnectionStringProvider
{
    public get ConnectionString(): string
    {
        if (process.env.MONGODB_URI === undefined)
        {
            throw new Error("Production connection string is not defined (in environment variables)");
        }

        return process.env.MONGODB_URI;
    }

    public get DatabaseName(): string
    {
        if (process.env.MONGODB_DB === undefined)
        {
            throw new Error("Production database name is not defined (in environment variables)");
        }

        return process.env.MONGODB_DB;
    }
}
