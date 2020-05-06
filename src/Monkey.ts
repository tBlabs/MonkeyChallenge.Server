import { DateTimeProvider } from './Services/DateTimeProvider/DateTimeProvider';
import { HangingDetector } from './Services/HangingDetector';
import { PushupsCounter } from './Services/PushupsCounter';
import { injectable } from 'inversify';

@injectable()
export class MonkeysFabric
{
    public Create(socket)
    {
        const pushapsCounter = new PushupsCounter();
        const hangingDetector = new HangingDetector(new DateTimeProvider());

        return new Monkey(pushapsCounter, hangingDetector, socket);
    }
}

export class Monkey
{
    constructor(
        private _pushupsCounter: PushupsCounter,
        private _hangingDetector: HangingDetector,
        private socket)
    {
        const monkeyId = socket.handshake.query.id;
        console.log(`monkey ${monkeyId} connected @ ${socket.id}`);

        socket.on('disconnect', () =>
        {
            console.log(`${monkeyId} disconnected`);
        });

        socket.on('update', update =>
        {
            //console.log(monkeyId, update);

            const obj = Object.keys(update);
            const sensor = obj[0];
            const value = update[sensor] ? 0 : 1;

            // Składanie stanu wszystkich małpek (czy to konieczne?)
          //  console.log(monkeyId, sensor, value);
            // webSocketHost.emit('monkey-update', update);
            /*    if (monkeys[monkeyId] == undefined)
                    monkeys[monkeyId] = { Sensors: {}};
    
                monkeys[monkeyId].Sensors[sensor] = value;
    
                webSocketHost.emit('monkeys-update', monkeys);
            */
            if (sensor === "SensorB" && (!_hangingDetector.IsCompleted))
            {
                _pushupsCounter.Update(value);
            }
            if (sensor === "SensorA")
            {
                _hangingDetector.Update(value);

                if (_hangingDetector.IsCompleted)
                {
                    console.log(`${monkeyId} did ${_pushupsCounter.Count} pushups in ${_hangingDetector.Duration}ms`);
                    _pushupsCounter.Reset();
                  //  AddRecord(duration, pushaps)
                }
            }

       
        });
    }
}