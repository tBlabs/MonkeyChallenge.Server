import { PushupsCounter } from './PushupsCounter';
import { MonkeyState } from './MonkeyState';
import { HangingDetector } from './HangingDetector';

export class SessionFormer
{
    constructor(
        private _pushupsCounter: PushupsCounter,
        private _hangingDetector: HangingDetector)
    { }

    public Form(update: MonkeyState, sessionReadyCallback: (duration, count) => void)
    {
        const obj = Object.keys(update);
        const sensorId: keyof MonkeyState = obj[0] as keyof MonkeyState;
        // const value = update[sensorId] ? 0 : 1;
        const value = update[sensorId] ? 1 : 0;

        if (sensorId === "SensorB" && (!this._hangingDetector.IsCompleted))
        {
            this._pushupsCounter.Update(value);
        }

        if (sensorId === "SensorA")
        {
            this._hangingDetector.Update(value);

            if (this._hangingDetector.IsCompleted)
            {
                if (0)
                if (this._hangingDetector.Duration < 5000)
                {
                    console.log(`Session was too short to be saved. Took only ${this._hangingDetector.Duration} ms.`);
                    this._pushupsCounter.Reset();
                    return;
                }

                sessionReadyCallback(this._hangingDetector.Duration, this._pushupsCounter.Count);

                this._pushupsCounter.Reset();
            }
        }
    }
}
