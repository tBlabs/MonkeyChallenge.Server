import { IDateTimeProvider } from './../Services/DateTimeProvider/DateTimeProvider';
import { WebClients } from '../Services/WebClients';
import { SessionRepository } from '../Persistance/Repository';
import { SessionEntity } from "../Persistance/Entities/SessionEntity";
import { SessionFormer } from './SessionFormer';
import { inject } from 'inversify';
import { Types } from '../IoC/Types';

export class Monkey
{
    constructor(
        
        private socket,
        private _repo: SessionRepository,
        private _web: WebClients,
        private _sessionFormer: SessionFormer)
    {
        const monkeyId = socket.handshake.query.id;
        console.log(`Monkey ${monkeyId} connected @ ${socket.id}`);

        socket.on('update', update =>
        {
            // console.log(monkeyId, update);       
            _web.SendMonkeyUpdate(monkeyId, update);

            _sessionFormer.Form(update, (duration, count) =>
            {
                // console.log(`${monkeyId} did ${count} pullups in ${duration}ms`);

                // if (0)
                _repo.AddSession(monkeyId, duration, count);
            });
        });
    }
}