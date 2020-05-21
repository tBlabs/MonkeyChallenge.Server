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
import { IStartupArgs } from '../Services/Environment/IStartupArgs';
import { StartupArgs } from '../Services/Environment/StartupArgs';
import { MonkeysFactory } from "../Monkey/MonkeysFactory";
import { SessionRepository } from './../Persistance/Repository';
import { WebClients } from './../WebClients';
import { IDateTimeProvider, DateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';

const IoC = new Container();

try
{
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IRunMode>(Types.IRunMode).to(RunMode).inSingletonScope().whenTargetIsDefault();
    IoC.bind<ILogger>(Types.ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IDateTimeProvider>(Types.IDateTimeProvider).to(DateTimeProvider).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(SessionRepository).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(MonkeysFactory).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<WebClients>(WebClients).toSelf().inSingletonScope().whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
