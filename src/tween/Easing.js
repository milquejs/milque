export function getFunctionByName(name)
{
    switch(name)
    {
        case 'linear':
            return Linear.Both;
        case 'quadratic':
        case 'quadratic-both':
        case 'quadratic-in-out':
            return Quadratic.Both;
        case 'quadratic-in':
            return Quadratic.In;
        case 'quadratic-out':
            return Quadratic.Out;
        case 'cubic':
        case 'cubic-both':
        case 'cubic-in-out':
            return Cubic.Both;
        case 'cubic-in':
            return Cubic.In;
        case 'cubic-out':
            return Cubic.Out;
        case 'sinusoidal':
        case 'sinusoidal-both':
        case 'sinusoidal-in-out':
            return Sinusoidal.Both;
        case 'sinusoidal-in':
            return Sinusoidal.In;
        case 'sinusoidal-out':
            return Sinusoidal.Out;
        case 'exponential':
        case 'exponential-both':
        case 'exponential-in-out':
            return Exponential.Both;
        case 'exponential-in':
            return Exponential.In;
        case 'exponential-out':
            return Exponential.Out;
        case 'circular':
        case 'circular-both':
        case 'circular-in-out':
            return Circular.Both;
        case 'circular-in':
            return Circular.In;
        case 'circular-out':
            return Circular.Out;
        case 'elastic':
        case 'elastic-both':
        case 'elastic-in-out':
            return Elastic.Both;
        case 'elastic-in':
            return Elastic.In;
        case 'elastic-out':
            return Elastic.Out;
        case 'back':
        case 'back-both':
        case 'back-in-out':
            return Back.Both;
        case 'back-in':
            return Back.In;
        case 'back-out':
            return Back.Out;
        case 'bounce':
        case 'bounce-both':
        case 'bounce-in-out':
            return Bounce.Both;
        case 'bounce-in':
            return Bounce.In;
        case 'bounce-out':
            return Bounce.Out;
        default:
            throw new Error(`Unknown easing function name '${name}'.`);
    }
}

export const Linear = {
    Both(k) { return k; }
};

export const Quadratic = {
    In(k) { return k * k; },
    Out(k) { return k * (2 - k); },
    Both(k)
    {
        if ((k *= 2) < 1)
        {
            return 0.5 * k * k;
        }
        else
        {
            return - 0.5 * (--k * (k - 2) - 1);
        }
    }
};

export const Cubic = {
    In(k) { return k * k * k; },
    Out(k) { return --k * k * k + 1; },
    Both(k)
    {
        if ((k *= 2) < 1)
        {
            return 0.5 * k * k * k;
        }
        else
        {
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    }
};

export const Sinusoidal = {
    In(k) { return 1 - Math.cos(k * Math.PI / 2); },
    Out(k) { return Math.sin(k * Math.PI / 2); },
    Both(k) { return 0.5 * (1 - Math.cos(Math.PI * k)); }
};

export const Exponential = {
    In(k) { return k === 0 ? 0 : Math.pow(1024, k - 1); },
    Out(k) { return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k); },
    Both(k)
    {
        if (k === 0) return 0;
        if (k === 1) return 1;
        if ((k *= 2) < 1)
        {
            return 0.5 * Math.pow(1024, k - 1);
        }
        else
        {
            return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
        }
    }
};

export const Circular = {
    In(k) { return 1 - Math.sqrt(1 - k * k); },
    Out(k) { return Math.sqrt(1 - (--k * k)); },
    Both(k)
    {
        if ((k *= 2) < 1) {
            return - 0.5 * (Math.sqrt(1 - k * k) - 1);
        }
        else
        {
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    }
};

export const Elastic = {
    In(k)
    {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },
    Out(k)
    {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },
    Both(k) {

        if (k === 0) return 0;
        if (k === 1) return 1;

        k *= 2;
        if (k < 1)
        {
            return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        }
        else
        {
            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        }
    }
};

export const Back = {
    In(k)
    {
        const s = 1.70158;
        return k * k * ((s + 1) * k - s);
    },
    Out(k)
    {
        const s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
    },
    Both(k)
    {
        const s = 1.70158 * 1.525;
        if ((k *= 2) < 1)
        {
            return 0.5 * (k * k * ((s + 1) * k - s));
        }
        else
        {
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    }
};

export const Bounce = {
    In(k) { return 1 - Bounce.Out(1 - k); },
    Out(k) {
        if (k < (1 / 2.75))
        {
            return 7.5625 * k * k;
        }
        else if (k < (2 / 2.75))
        {
            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        }
        else if (k < (2.5 / 2.75))
        {
            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        }
        else
        {
            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
        }
    },
    Both(k) {
        if (k < 0.5)
        {
            return Bounce.In(k * 2) * 0.5;
        }
        else
        {
            return Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    }
};
