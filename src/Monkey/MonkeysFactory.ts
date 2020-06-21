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
    private monkeys: string[] = [];
   

    constructor(private _repo: SessionRepository,
        private _web: WebClients,
        @inject(Types.IDateTimeProvider) private _date: DateTimeProvider) { }

    private count = 0;

    public Create(socket)
    {
        const pushupsCounter = new PushupsCounter();
        const hangingDetector = new HangingDetector(new DateTimeProvider());
        const sessionFormer = new SessionFormer(pushupsCounter, hangingDetector);

        const monkeyId = socket.handshake.query.id;
        this.monkeys.push(monkeyId);
        
        new Monkey(socket, this._repo, this._web, sessionFormer);
    }

    public get MonkeysIds(): string
    {
        return this.monkeys.join();
    }

    public get Count()
    {
        return this.monkeys.length;
    }
}
