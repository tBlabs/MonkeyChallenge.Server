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
                // console.log(`${monkeyId} did ${count} pullups in ${duration}ms`);
                // if (0)
                // _repo.AddSession(monkeyId, duration, count);
                _repo.AddSession(new SessionEntity_1.SessionEntity(monkeyId, _date.Now, duration, count));
            });
        });
    }
}
exports.Monkey = Monkey;
//# sourceMappingURL=Monkey.js.map