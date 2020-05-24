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
const mongodb_1 = require("mongodb");
const Session_1 = require("./Session");
const inversify_1 = require("inversify");
const Types_1 = require("../IoC/Types");
let SessionRepository = class SessionRepository {
    constructor(_date) {
        this._date = _date;
    }
    MinusDays(d, days) {
        const date = new Date();
        return new Date(date.setDate(date.getDate() - days));
    }
    GetLastTotals(monkeyId, days) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = this._date.Now;
            const from = this.MinusDays(now, days);
            const totals = yield this.GetTotals(monkeyId, { from: from, to: now });
            if (totals.length > days)
                throw new Error(`There should be only one entry per day but was more (${totals.length} where max is ${days}).`);
            return totals;
        });
    }
    GetTotals(monkeyId, range) {
        return __awaiter(this, void 0, void 0, function* () {
            range.to.setHours(25);
            range.to.setMinutes(59);
            range.to.setSeconds(59);
            range.to.setMilliseconds(999);
            const query = { MonkeyId: monkeyId, Date: { "$gte": range.from, "$lte": range.to } };
            // console.log('QUERY', JSON.stringify(query));
            let totals = yield this.totalsCollection.find(query).toArray();
            return totals.map(x => new Session_1.DailySummary(x.Date, x.SessionsCount, x.TotalPushups, x.SessionsCount));
        });
    }
    Drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sessionsCollection.drop();
                yield this.totalsCollection.drop();
                yield this.summariesCollection.drop();
            }
            catch (error) { }
        });
    }
    Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uri = "mongodb://heroku_p0sgdkrk:h0iopgndqjhrochm8qp3crknpn@ds341247.mlab.com:41247/heroku_p0sgdkrk";
                this.client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                yield this.client.connect();
                console.log("Connected successfully to database server");
                this.db = this.client.db("heroku_p0sgdkrk");
                this.sessionsCollection = this.db.collection("sessions");
                this.totalsCollection = this.db.collection("totals");
                this.summariesCollection = this.db.collection("summaries");
            }
            catch (error) {
                console.log('DATABASE PROBLEM:', error);
            }
        });
    }
    Close() {
        this.client.close();
    }
    AddSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sessionsCollection.insertOne(session);
            yield this.UpdateTotal(session);
            yield this.UpdateSummary(session);
        });
    }
    UpdateSummary(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchObj = { MonkeyId: session.MonkeyId };
            let summary = yield this.summariesCollection.findOne(searchObj);
            if (summary == null) {
                summary = new Session_1.MonkeySummary(session.MonkeyId, session.Duration, session.Pushups, 1);
                yield this.summariesCollection.insertOne(summary);
            }
            else {
                summary.TotalDuration += session.Duration;
                summary.TotalPushups += session.Pushups;
                summary.SessionsCount += 1;
                yield this.summariesCollection.replaceOne(searchObj, summary);
            }
        });
    }
    UpdateTotal(session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.Date.setHours(2); // Nie mam pojęcia czemu trzeba wpisać 2 żeby w bazie była godzina 00
            session.Date.setMinutes(0);
            session.Date.setSeconds(0);
            session.Date.setMilliseconds(0);
            const searchObj = { MonkeyId: session.MonkeyId, Date: session.Date };
            let total = yield this.totalsCollection.findOne(searchObj);
            if (total == null) {
                total = new Session_1.MonkeyDay(session.MonkeyId, session.Date, session.Duration, session.Pushups, 1);
                yield this.totalsCollection.insertOne(total);
            }
            else {
                total.TotalDuration += session.Duration;
                total.TotalPushups += session.Pushups;
                total.SessionsCount += 1;
                yield this.totalsCollection.replaceOne(searchObj, total);
            }
        });
    }
};
SessionRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IDateTimeProvider)),
    __metadata("design:paramtypes", [Object])
], SessionRepository);
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=Repository.js.map