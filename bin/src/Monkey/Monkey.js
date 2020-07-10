"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionEntity_1 = require("../Persistance/Entities/SessionEntity");
class Monkey {
    constructor(socket, _repo, _web, _sessionFormer, _date) {
        const monkeyId = socket.handshake.query.id;
        console.log(`Monkey ${monkeyId} connected @ ${socket.id}`);
        socket.on('update', update => {
            // console.log(monkeyId, update);       
            _web.SendMonkeyUpdate(monkeyId, update);
            _sessionFormer.Form(update, (duration, count) => {
                console.log(`${monkeyId} did ${count} pullups in ${duration}ms @ ${_date.DateAsString} ${_date.TimeAsString}`);
                if (this.ValidateSession(duration, count)) {
                    _repo.AddSession(new SessionEntity_1.SessionEntity(monkeyId, _date.Now, duration, count));
                }
            });
        });
    }
    ValidateSession(duration, count) {
        if ((count === 0) && (duration < 3000)) {
            console.log(`Session was too short to save.`);
            return false;
        }
        if (duration > 5 * 60 * 1000) {
            console.log(`This session was suspiciously too long (took ${duration}, limit is 5 minutes) and will not be save.`);
            return false;
        }
        return true;
    }
}
exports.Monkey = Monkey;
//# sourceMappingURL=Monkey.js.map