"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Session {
    constructor(MonkeyId, Date, Duration, Pushups) {
        this.MonkeyId = MonkeyId;
        this.Date = Date;
        this.Duration = Duration;
        this.Pushups = Pushups;
    }
}
exports.Session = Session;
class MonkeySummary {
    constructor(MonkeyId, TotalDuration, TotalPushups, SessionsCount) {
        this.MonkeyId = MonkeyId;
        this.TotalDuration = TotalDuration;
        this.TotalPushups = TotalPushups;
        this.SessionsCount = SessionsCount;
    }
}
exports.MonkeySummary = MonkeySummary;
class MonkeyDay {
    constructor(MonkeyId, Date, TotalDuration, TotalPushups, SessionsCount) {
        this.MonkeyId = MonkeyId;
        this.Date = Date;
        this.TotalDuration = TotalDuration;
        this.TotalPushups = TotalPushups;
        this.SessionsCount = SessionsCount;
    }
    toString() {
        return `${this.MonkeyId} did ${this.TotalPushups} pushaps in ${this.TotalDuration} (in ${this.SessionsCount} sessions) @ ${this.Date.toDateString()}`;
    }
}
exports.MonkeyDay = MonkeyDay;
class DailySummary {
    constructor(Date, TotalDuration, TotalPushups, SessionsCount) {
        this.Date = Date;
        this.TotalDuration = TotalDuration;
        this.TotalPushups = TotalPushups;
        this.SessionsCount = SessionsCount;
    }
    toString() {
        return `${this.TotalPushups} pushaps in ${this.TotalDuration} (in ${this.SessionsCount} sessions) @ ${this.Date.toDateString()}`;
    }
}
exports.DailySummary = DailySummary;
//# sourceMappingURL=Session.js.map