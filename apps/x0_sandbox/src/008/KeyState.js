export class KeyState
{
    constructor(keyMap)
    {
        let next = {};
        let prev = {};
        let state = {};

        for(let inputName of Object.keys(keyMap))
        {
            let { device, key, meta } = keyMap[inputName];

            let values = { value: 0, delta: 0 };

            if (!(device in next)) next[device] = {};
            next[device][key] = 0;

            if (!(device in prev)) prev[device] = {};
            prev[device][key] = values;

            state[inputName] = values;
        }
        
        this._next = next;
        this._prev = prev;

        this.state = state;
    }

    poll()
    {
        let next = this._next;
        let prev = this._prev;

        let flag = false;
        for(let device of Object.keys(next))
        {
            let deviceKeys = next[device];
            for(let key of Object.keys(deviceKeys))
            {
                let nextValue = deviceKeys[key];
                
                let prevState = prev[device][key];
                let prevValue = prevState.value;
                let prevDelta = prevState.delta;
                if (nextValue !== prevValue)
                {
                    prevState.delta = nextValue - prevValue;
                    prevState.value = nextValue;
                    flag = true;
                }
                else if (prevDelta)
                {
                    prevState.delta = 0;
                    flag = true;
                }
            }
        }
        return flag;
    }
    
    updateKey(device, key, event, value)
    {
        let next = this._next;

        if (device in next)
        {
            let deviceKeys = next[device];

            if (key in deviceKeys)
            {
                switch(event)
                {
                    case 'down':
                        deviceKeys[key] = 1;
                        return false;
                    case 'up':
                        deviceKeys[key] = 0;
                        return false;
                    default:
                        throw new Error(`Unknown key event type '${event}'.`);
                }
            }
        }
    }
    
    updatePos(device, key, x, y, dx, dy)
    {
        let next = this._next;

        if (device in next)
        {
            let deviceKeys = next[device];

            if (dx)
            {
                let dname = 'dx' + (dx < 0 ? '-' : '+');
                if (dname in deviceKeys) deviceKeys[dname] = dx;
                if ('x' in deviceKeys) deviceKeys.x = x;
            }

            if (dy)
            {
                let dname = 'dy' + (dx < 0 ? '-' : '+');
                if (dname in deviceKeys) deviceKeys[dname] = dy;
                if ('y' in deviceKeys) deviceKeys.y = y;
            }
        }
    }
}
