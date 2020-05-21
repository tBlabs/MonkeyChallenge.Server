"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Session {
    constructor(MonkeyId, Date, Time, Duration, Pushups) {
        this.MonkeyId = MonkeyId;
        this.Date = Date;
        this.Time = Time;
        this.Duration = Duration;
        this.Pushups = Pushups;
    }
}
exports.Session = Session;
class Total {
    constructor(MonkeyId, Date, TotalDuration, TotalPushups) {
        this.MonkeyId = MonkeyId;
        this.Date = Date;
        this.TotalDuration = TotalDuration;
        this.TotalPushups = TotalPushups;
    }
}
exports.Total = Total;
//# sourceMappingURL=Session.js.map