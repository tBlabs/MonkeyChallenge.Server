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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const MonkeyTotalEntity_1 = require("./Entities/MonkeyTotalEntity");
const MonkeyDailyTotalEntity_1 = require("./Entities/MonkeyDailyTotalEntity");
const SessionEntity_1 = require("./Entities/SessionEntity");
const inversify_1 = require("inversify");
const Types_1 = require("../IoC/Types");
const Database_1 = require("./Database");
let SessionRepository = class SessionRepository {
    constructor(_db, _date) {
        this._db = _db;
        this._date = _date;
    }
    Init() {
        this.sessionsCollection = this._db.Collection("sessions");
        this.totalsCollection = this._db.Collection("totals");
        this.dailyTotalsCollection = this._db.Collection("dailyTotals");
    }
    MinusDays(d, days) {
        const date = new Date();
        return new Date(date.setDate(date.getDate() - days));
    }
    GetLastTotals(monkeyId, days) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = this._date.Now;
            const from = this.MinusDays(now, days);
            const totals = yield this.GetDailyTotals(monkeyId, { from: from, to: now });
            //   if (totals.length > days) throw new Error(`There should be only one entry per day but was more (${totals.length} where max is ${days}).`)
            return totals;
        });
    }
    GetDailyTotals(monkeyId, range) {
        return __awaiter(this, void 0, void 0, function* () {
            range.to.setHours(25);
            range.to.setMinutes(59);
            range.to.setSeconds(59);
            range.to.setMilliseconds(999);
            const query = { MonkeyId: monkeyId, Date: { "$gte": range.from, "$lte": range.to } };
            // console.log('QUERY', JSON.stringify(query));
            let totals = yield this.dailyTotalsCollection.find(query).toArray();
            return totals.map(x => new MonkeyDailyTotalEntity_1.MonkeyDailyTotalEntity(monkeyId, x.Date, x.SessionsCount, x.TotalPushups, x.SessionsCount));
        });
    }
    GetMonkeyTotal(monkeyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { MonkeyId: monkeyId };
            let total = yield this.totalsCollection.findOne(query);
            if (total === null)
                return MonkeyTotalEntity_1.MonkeyTotalEntity.Empty;
            return total;
        });
    }
    Drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sessionsCollection.drop();
                yield this.dailyTotalsCollection.drop();
                yield this.totalsCollection.drop();
            }
            catch (error) { }
        });
    }
    AddSession(id, duration, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = new SessionEntity_1.SessionEntity(id, this._date.Now, duration, count);
            try {
                if (0)
                    yield this.sessionsCollection.insertOne(session);
                yield this.UpdateDailyTotal(session);
                yield this.UpdateTotal(session);
            }
            catch (error) {
                console.log('MONGODB ERROR', error);
            }
        });
    }
    UpdateTotal(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchObj = { MonkeyId: session.MonkeyId };
            let summary = yield this.totalsCollection.findOne(searchObj);
            if (summary == null) {
                summary = new MonkeyTotalEntity_1.MonkeyTotalEntity(session.MonkeyId, session.Duration, session.Pushups, 1);
                yield this.totalsCollection.insertOne(summary);
            }
            else {
                summary.TotalDuration += session.Duration;
                summary.TotalPushups += session.Pushups;
                summary.SessionsCount += 1;
                //console.log('T', summary);
                yield this.totalsCollection.replaceOne(searchObj, summary);
            }
        });
    }
    UpdateDailyTotal(session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.Date.setHours(2); // Nie mam pojęcia czemu trzeba wpisać 2 żeby w bazie była godzina 00
            session.Date.setMinutes(0);
            session.Date.setSeconds(0);
            session.Date.setMilliseconds(0);
            const searchObj = { MonkeyId: session.MonkeyId, Date: session.Date };
            let total = yield this.dailyTotalsCollection.findOne(searchObj);
            if (total == null) {
                total = new MonkeyDailyTotalEntity_1.MonkeyDailyTotalEntity(session.MonkeyId, session.Date, session.Duration, session.Pushups, 1);
                yield this.dailyTotalsCollection.insertOne(total);
            }
            else {
                total.TotalDuration += session.Duration;
                total.TotalPushups += session.Pushups;
                total.SessionsCount += 1;
                yield this.dailyTotalsCollection.replaceOne(searchObj, total);
            }
        });
    }
};
SessionRepository = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(Types_1.Types.IDateTimeProvider)),
    __metadata("design:paramtypes", [Database_1.Database, Object])
], SessionRepository);
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=Repository.js.map