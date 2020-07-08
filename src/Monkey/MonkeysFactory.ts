import {WebClients} from '../Services/WebClients';
import {DateTimeProvider} from '../Services/DateTimeProvider/DateTimeProvider';
import {PullupsCounter} from './PullupsCounter';
import {injectable, inject} from 'inversify';
import {SessionRepository} from '../Persistance/SessionRepository';
import {SessionFormer} from './SessionFormer';
import {Monkey} from './Monkey';
import {HangingDetector} from './HangingDetector';
import {Types} from '../IoC/Types';

@injectable()
export class MonkeysFactory
{
    private monkeysIds: string[] = [];

    constructor(private _repo: SessionRepository,
        private _web: WebClients,
        @inject(Types.IDateTimeProvider) private _date: DateTimeProvider)
    {}

    public Create(socket)
    {
        const pullupsCounter = new PullupsCounter();
        const hangingDetector = new HangingDetector(this._date);
        const sessionFormer = new SessionFormer(pullupsCounter, hangingDetector);

        const monkeyId = socket.handshake.query.id;
        this.monkeysIds.push(monkeyId);

        socket.on('disconnect', () =>
        {
            console.log(`${monkeyId} disconnected`);

            const mInd = this.MonkeysIds.indexOf(monkeyId);
            this.monkeysIds.splice(mInd, 1);
        });

        new Monkey(socket, this._repo, this._web, sessionFormer, this._date);
    }

    public get MonkeysIds(): string
    {
        return this.monkeysIds.join();
    }

    public get Count()
    {
        return this.monkeysIds.length;
    }
}
