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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Session_1 = require("./Session");
const inversify_1 = require("inversify");
const Types_1 = require("../IoC/Types");
let SessionRepository = class SessionRepository {
    constructor(_date) {
        this._date = _date;
    }
    async Connect() {
        try {
            const uri = "mongodb://heroku_p0sgdkrk:h0iopgndqjhrochm8qp3crknpn@ds341247.mlab.com:41247/heroku_p0sgdkrk";
            this.client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await this.client.connect();
            console.log("Connected successfully to database server");
            this.db = this.client.db("heroku_p0sgdkrk");
            this.sessionsCollection = this.db.collection("sessions");
            this.totalsCollection = this.db.collection("totals");
        }
        catch (error) {
            console.log('DB PROBLEM', error);
        }
    }
    Close() {
        this.client.close();
    }
    async Get() {
        const result = await this.sessionsCollection.find({}).toArray();
        console.log('RRR', result);
    }
    async AddSession(session) {
        this.sessionsCollection.insertOne(session);
        await this.UpdateTotal(session);
    }
    async UpdateTotal(session) {
        const searchObj = { MonkeyId: session.MonkeyId, Date: session.Date };
        // console.log('sssss',  searchObj);
        // let total: Total = (await this.totalsCollection.find(searchObj).toArray())[0];
        let total = await this.totalsCollection.findOne(searchObj);
        // console.log('ttt', total);
        if (total == null) {
            total = new Session_1.Total(session.MonkeyId, session.Date, session.Duration, session.Pushups);
            this.totalsCollection.insertOne(total);
            // console.log('inserted', total); 
        }
        else {
            total.TotalDuration += session.Duration;
            total.TotalPushups += session.Pushups;
            this.totalsCollection.replaceOne(searchObj, total);
            // console.log('updated', total);  
        }
    }
};
SessionRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IDateTimeProvider)),
    __metadata("design:paramtypes", [Object])
], SessionRepository);
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=Repository.js.map