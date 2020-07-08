import { WebClients } from '../Services/WebClients';
import { SessionRepository } from '../Persistance/SessionRepository';
import { SessionFormer } from './SessionFormer';
import { SessionEntity } from '../Persistance/Entities/SessionEntity';
import { IDateTimeProvider } from '../Services/DateTimeProvider/DateTimeProvider';

export class Monkey
{
    constructor(
        socket,
        _repo: SessionRepository,
        _web: WebClients,
        _sessionFormer: SessionFormer,
        _date: IDateTimeProvider)
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
                // _repo.AddSession(monkeyId, duration, count);
                _repo.AddSession(new SessionEntity(monkeyId, _date.Now, duration, count));
            });
        });
    }
}