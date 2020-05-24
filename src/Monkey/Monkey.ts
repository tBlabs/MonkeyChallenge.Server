import { IDateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';
import { WebClients } from '../WebClients';
import { SessionRepository } from '../Persistance/Repository';
import { Session } from '../Persistance/Session';
import { SessionFormer } from './SessionFormer';
import { inject } from 'inversify';
import { Types } from '../IoC/Types';

export class Monkey
{
    constructor(
        private _repo: SessionRepository,
        private _web: WebClients,
        private _sessionFormer: SessionFormer,
        private socket,
        private _date: IDateTimeProvider)
    {
        const monkeyId = socket.handshake.query.id;
        console.log(`${monkeyId} connected @ ${socket.id}`);

        socket.on('disconnect', () =>
        {
            console.log(`${monkeyId} disconnected`);
        });

        socket.on('update', update =>
        {
            // console.log(monkeyId, update);       
            _web.SendMonkeyUpdate(monkeyId, update);

            _sessionFormer.Form(update, (duration, count) =>
            {
                console.log(`${monkeyId} did ${count} pushups in ${duration}ms`);

                // if (0)
                _repo.AddSession(new Session(monkeyId, _date.Now, duration, count));
            });
        });
    }
}