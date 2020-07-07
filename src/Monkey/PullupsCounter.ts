export class PullupsCounter
{
    private count = 0;
    private previousState = 0;
    
    public get Count()
    {
        return this.count;
    }

    public Reset()
    {
        this.count = 0;
    }

    public Update(state: number)
    {
        if ((state === 0) && (this.previousState === 1))
        {
            this.count++;
        }

        this.previousState = state;
    }
}
