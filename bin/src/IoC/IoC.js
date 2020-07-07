"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// These two imports must go first!
require("reflect-metadata");
const Types_1 = require("./Types");
const inversify_1 = require("inversify");
const Environment_1 = require("../Services/Environment/Environment");
const RunMode_1 = require("../Services/RunMode/RunMode");
const Logger_1 = require("../Services/Logger/Logger");
const Main_1 = require("../Main");
const Host_1 = require("../Services/Host");
const HostConfig_1 = require("../Services/HostConfig");
const StartupArgs_1 = require("../Services/Environment/StartupArgs");
const MonkeysFactory_1 = require("../Monkey/MonkeysFactory");
const Repository_1 = require("./../Persistance/Repository");
const MonkeysRepo_1 = require("./../Persistance/MonkeysRepo");
const Database_1 = require("./../Persistance/Database");
const WebClients_1 = require("../Services/WebClients");
const DateTimeProvider_1 = require("./../Services/DateTimeProvider/DateTimeProvider");
const IoC = new inversify_1.Container();
exports.IoC = IoC;
try {
    IoC.bind(Types_1.Types.IEnvironment).to(Environment_1.Environment).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IRunMode).to(RunMode_1.RunMode).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.ILogger).to(Logger_1.Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IDateTimeProvider).to(DateTimeProvider_1.DateTimeProvider).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IStartupArgs).to(StartupArgs_1.StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Database_1.Database).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(MonkeysRepo_1.MonkeysRepo).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Repository_1.SessionRepository).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(MonkeysFactory_1.MonkeysFactory).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Main_1.Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(WebClients_1.WebClients).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Host_1.Host).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(HostConfig_1.HostConfig).toSelf().inSingletonScope().whenTargetIsDefault();
}
catch (ex) {
    console.log('IoC exception:', ex);
}
//# sourceMappingURL=IoC.js.map