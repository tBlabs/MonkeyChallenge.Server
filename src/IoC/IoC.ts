// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';
import { IEnvironment } from '../Services/Environment/IEnvironment';
import { Environment } from '../Services/Environment/Environment';
import { IRunMode } from '../Services/RunMode/IRunMode';
import { RunMode } from '../Services/RunMode/RunMode';
import { ILogger } from '../Services/Logger/ILogger';
import { Logger } from '../Services/Logger/Logger';
import { Main } from '../Main';
import { Host } from "../Services/Host";
import { HostConfig } from "../Services/HostConfig";
import { IStartupArgs } from '../Services/Environment/IStartupArgs';
import { StartupArgs } from '../Services/Environment/StartupArgs';
import { MonkeysFactory } from "../Monkey/MonkeysFactory";
import { SessionRepository } from '../Persistance/SessionRepository';
import { MonkeysRepo } from "./../Persistance/MonkeysRepo";
import { Database } from "./../Persistance/Database";
import { WebClients } from '../Services/WebClients';
import { IDateTimeProvider, DateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';
import { IDatabaseConnectionStringProvider } from '../Persistance/IDatabaseConnectionStringProvider';
import { ProductionDatabaseConnectionStringProvider } from '../Persistance/ProductionDatabaseConnectionStringProvider';
import { TestDatabaseConnectionStringProvider } from '../Persistance/TestDatabaseConnectionStringProvider';

const IoC = new Container();

try
{
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IRunMode>(Types.IRunMode).to(RunMode).inSingletonScope().whenTargetIsDefault();
    IoC.bind<ILogger>(Types.ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IDateTimeProvider>(Types.IDateTimeProvider).to(DateTimeProvider).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Database).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(MonkeysRepo).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(SessionRepository).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(MonkeysFactory).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<WebClients>(WebClients).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Host>(Host).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<HostConfig>(HostConfig).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IDatabaseConnectionStringProvider>(Types.IDatabaseConnectionStringProvider).to(ProductionDatabaseConnectionStringProvider).inSingletonScope().whenTargetIsDefault();
    // IoC.bind<IDatabaseConnectionStringProvider>(Types.IDatabaseConnectionStringProvider).to(TestDatabaseConnectionStringProvider).inSingletonScope().whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
