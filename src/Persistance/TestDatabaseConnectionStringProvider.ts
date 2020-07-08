import { injectable } from 'inversify';
import { IDatabaseConnectionStringProvider } from './IDatabaseConnectionStringProvider';

@injectable()
export class TestDatabaseConnectionStringProvider implements IDatabaseConnectionStringProvider
{
    public get ConnectionString(): string
    {
        if (process.env.MONGOLAB_GREEN_URI === undefined)
        {
            throw new Error("Connection string for test database is not defined (in environment variables)");
        }

        return process.env.MONGOLAB_GREEN_URI;
    }
    
    public get DatabaseName(): string
    {
        if (process.env.MONGOLAB_GREEN_DB === undefined)
        {
            throw new Error("Test database name is not defined (in environment variables)");
        }

        return process.env.MONGOLAB_GREEN_DB;
    }
}
