import { WebClients } from '../WebClients';
import { DateTimeProvider } from '../Services/DateTimeProvider/DateTimeProvider';
import { PushupsCounter } from './PushupsCounter';
import { injectable, inject } from 'inversify';
import { SessionRepository } from '../Persistance/Repository';
import { SessionFormer } from './SessionFormer';
import { Monkey } from './Monkey';
import { HangingDetector } from './HangingDetector';
import { Types } from '../IoC/Types';

@injectable()
export class MonkeysFactory
{
    constructor(private _repo: SessionRepository, 
        private _web: WebClients,
        @inject(Types.IDateTimeProvider) private _date: DateTimeProvider) { }
    
    public Create(socket)
    {
        const pushupsCounter = new PushupsCounter();
        const hangingDetector = new HangingDetector(new DateTimeProvider());
        const sessionFormer = new SessionFormer(pushupsCounter, hangingDetector);

        return new Monkey(socket, this._repo, this._web, sessionFormer);
    }
}
