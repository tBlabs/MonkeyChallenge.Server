"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("./Persistance/Session");
class Monkey {
    constructor(_repo, _web, _sessionFormer, socket) {
        this._repo = _repo;
        this._web = _web;
        this._sessionFormer = _sessionFormer;
        this.socket = socket;
        const monkeyId = socket.handshake.query.id;
        console.log(`${monkeyId} connected @ ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`${monkeyId} disconnected`);
        });
        socket.on('update', update => {
            //console.log(monkeyId, update);       
            _web.SendMonkeyUpdate(monkeyId, update);
            _sessionFormer.Form(update, (duration, count) => {
                console.log(`${monkeyId} did ${count} pushups in ${duration}ms`);
                _repo.AddSession(new Session_1.Session(monkeyId, new Date(), duration, count));
            });
        });
    }
}
exports.Monkey = Monkey;
//# sourceMappingURL=Monkey.js.map