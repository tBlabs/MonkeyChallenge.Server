"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monkey {
    constructor(socket, _repo, _web, _sessionFormer) {
        this.socket = socket;
        this._repo = _repo;
        this._web = _web;
        this._sessionFormer = _sessionFormer;
        const monkeyId = socket.handshake.query.id;
        console.log(`Monkey ${monkeyId} connected @ ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`${monkeyId} disconnected`);
        });
        socket.on('update', update => {
            // console.log(monkeyId, update);       
            _web.SendMonkeyUpdate(monkeyId, update);
            _sessionFormer.Form(update, (duration, count) => {
                // console.log(`${monkeyId} did ${count} pushups in ${duration}ms`);
                // if (0)
                _repo.AddSession(monkeyId, duration, count);
            });
        });
    }
}
exports.Monkey = Monkey;
//# sourceMappingURL=Monkey.js.map