import { PullupsCounter } from './PullupsCounter';
import { MonkeyState } from './MonkeyState';
import { HangingDetector } from './HangingDetector';

export class SessionFormer
{
    constructor(
        private _pullupsCounter: PullupsCounter,
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
            this._pullupsCounter.Update(value);
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
                    this._pullupsCounter.Reset();
                    return;
                }

                sessionReadyCallback(this._hangingDetector.Duration, this._pullupsCounter.Count);

                this._pullupsCounter.Reset();
            }
        }
    }
}
