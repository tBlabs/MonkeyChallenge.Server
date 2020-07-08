"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MonkeysFactory_1 = require("./Monkey/MonkeysFactory");
const inversify_1 = require("inversify");
const SessionRepository_1 = require("./Persistance/SessionRepository");
const MonkeyEntity_1 = require("./Persistance/Entities/MonkeyEntity");
const MonkeysRepo_1 = require("./Persistance/MonkeysRepo");
const Database_1 = require("./Persistance/Database");
const WebClients_1 = require("./Services/WebClients");
const HelpBuilder_1 = require("./Services/HelpBuilder");
const MonkeysPictures_1 = require("./ForTesting/MonkeysPictures");
const Host_1 = require("./Services/Host");
const SessionEntity_1 = require("./Persistance/Entities/SessionEntity");
let Main = class Main {
    constructor(_host, _db, _usersRepo, _sessionsRepo, _monkeysFactory, _webClients) {
        this._host = _host;
        this._db = _db;
        this._usersRepo = _usersRepo;
        this._sessionsRepo = _sessionsRepo;
        this._monkeysFactory = _monkeysFactory;
        this._webClients = _webClients;
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('start');
            yield this._db.Init();
            this._usersRepo.Init();
            yield this._sessionsRepo.Init();
            this._sessionsRepo.AddSession(new SessionEntity_1.SessionEntity("aaa", new Date(), 3, 4));
            if (0) {
                yield this._usersRepo.Drop();
                yield this._usersRepo.Add(new MonkeyEntity_1.MonkeyEntity("Monkey1", ["Group1", "Group2"], MonkeysPictures_1.Monkey1Picture));
                yield this._usersRepo.Add(new MonkeyEntity_1.MonkeyEntity("GhostMonkey1", ["Group1", "Group3"], MonkeysPictures_1.Monkey2Picture));
                yield this._usersRepo.Add(new MonkeyEntity_1.MonkeyEntity("GhostMonkey2", ["Group2", "Group4"], MonkeysPictures_1.Monkey2Picture));
            }
            const webClients = this._host.SocketHost.of('/web');
            const drivers = this._host.SocketHost.of('/monkey');
            webClients.on('connection', (socket) => {
                console.log('web connection @', socket.id);
                this._webClients.Add(socket);
            });
            drivers.on('connection', (socket) => {
                this._monkeysFactory.Create(socket);
            });
            // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey1", 3000, 600));
            // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey2", 5000, 1000));
            // this._monkeysFactory.Create(new GhostMonkeySocket("GhostMonkey3", 1000, 200));
            const hb = new HelpBuilder_1.HelpBuilder("MonkeyChallenge.Server")
                .Status("Drivers connected", () => this._monkeysFactory.Count.toString() + " (" + (this._monkeysFactory.MonkeysIds.length > 0 ? this._monkeysFactory.MonkeysIds : "none") + ")")
                .Status("Web clients connected", () => this._webClients.List.length.toString())
                .Config("Static files", this._host.ClientDir, "app dir", "C:\\Projects\\App\\client", "code")
                .Api("/public/index.html", "Simple web client; prints monkeys sensors state (only one change at a time)")
                .Api("/group/:name", "Get monkeys from a given group")
                .Api("/:monkeyId/total", "Returns MonkeySummary of monkey")
                .Api("/:monkeyId/last/:days", "Returns last {days} of MonkeyDay");
            this._host.OnGet('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.send(hb.ToString());
            }));
            this._host.OnGet('/:monkeyId/last/:days', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const monkeyId = req.params.monkeyId;
                const days = +req.params.days;
                const result = yield this._sessionsRepo.GetLastTotals(monkeyId, days);
                // console.log('res', result);
                res.send(result);
            }));
            this._host.OnGet('/:monkeyId/total', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this._sessionsRepo.GetMonkeyTotal(req.params.monkeyId);
                // console.log('Monkey total:', result);
                res.send(result);
            }));
            this._host.OnGet('/group/:name', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this._usersRepo.GetByGroup(req.params.name);
                res.send(result);
            }));
            this._host.Start();
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Host_1.Host,
        Database_1.Database,
        MonkeysRepo_1.MonkeysRepo,
        SessionRepository_1.SessionRepository,
        MonkeysFactory_1.MonkeysFactory,
        WebClients_1.WebClients])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map