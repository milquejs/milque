// NOTE: Based on https://github.com/tweenjs/tween.js

// TODO: Do we need Tween Groups to separate updates?

import Eventable from '../util/Eventable.js';
import * as Easing from './Easing.js';
import * as Interpolation from './Interpolation.js';

let NEXT_ID = 1;
class Tween
{
    static now() { return Date.now(); }

    constructor(target)
    {
        this.target = target;
        this.id = NEXT_ID++;
        this.active = false;
        this.startTime = 0;
        this.startProperties = {};
        this.repeatProperties = {};
        this.reversed = false;

        this.endProperties = {};
        this.nexts = [];
        this.easingFunction = Easing.Linear.Both;
        this.interpolationFunction = Interpolation.Linear;

        this._duration = 1000;
        this._startDelay = 0;
        this._repeatDelay = 0;
        this._repeat = 0;
        this._yoyo = false;

        this.firstUpdate = false;
    }

    to(properties, duration = undefined)
    {
        this.endProperties = Object.create(properties);

        if (typeof duration !== 'undefined') this._duration = duration;
        return this;
    }

    next(...tweens)
    {
        this.nexts = tweens;
        return this;
    }

    start(time = undefined)
    {
        if (typeof time === 'undefined')
        {
            this.startTime = Tween.now();
        }
        else
        {
            this.startTime = time;
        }
        this.startTime += this._startDelay;

        for(const property in this.endProperties)
        {
            // Can only tween properties that already exist.
            if (!(property in this.target)) throw new Error('Cannot tween non-existent property.');

            const targetProperty = this.target[property];

            // Can only tween number properties.
            if (typeof targetProperty !== 'number') throw new Error('Cannot tween non-number property.');

            const endProperty = this.endProperties[property];

            // Don't forget to include initial state when interpolating...
            if (Array.isArray(endProperty))
            {
                this.endProperties[property] = [targetProperty, ...endProperty];
            }
            else if (typeof endProperty !== 'function' && typeof endProperty !== 'number')
            {
                throw new Error('Unable to tween unknown end property type.')
            }

            this.startProperties[property] = targetProperty;
            this.repeatProperties[property] = this.startProperties[property];
        }
        
        this.active = true;
        this.firstUpdate = true;
        return this;
    }

    stop(finish = false)
    {
        if (!this.active) return this;

        this.active = false;
        if (finish)
        {
            this.update(Infinity);
        }
        else
        {
            for(const next of this.nexts)
            {
                next.stop();
            }
        }
        return this;
    }

    update(time = Tween.now())
    {
        if (time < this.startTime) return true;

        if (this.firstUpdate)
        {
            this.firstUpdate = false;
            this.emit('start', this.target);
        }

        const elapsed = this._duration > 0 ? Math.min((time - this.startTime) / this._duration, 1) : 1;
        const progress = this.easingFunction(elapsed);

        for(const property in this.endProperties)
        {
            if (!(property in this.startProperties)) continue;

            const start = this.startProperties[property];
            const end = this.endProperties[property];
            this.target[property] = this.getTweenValue(start, end, progress);
        }

        this.emit('update', this.target, elapsed);

        if (elapsed >= 1)
        {
            if (this._repeat > 0)
            {
                if (Number.isFinite(this._repeat)) --this._repeat;

                for(const property in this.repeatProperties)
                {
                    // Reverse the start and end states for repeat yoyos.
                    if (this._yoyo)
                    {
                        const repeatValue = this.repeatProperties[property];
                        this.repeatProperties[property] = this.endProperties[property];
                        this.endProperties[property] = repeatValue;

                        // This would only happen on the return of the yoyo, where the start was the new endpoint.
                        if (typeof this.repeatProperties[property] === 'function')
                        {
                            // Therefore, we can safely assume 2 things:
                            // - The repeat and end properties were swapped, since repeat values can only be initially set as numbers.
                            // - The respective end property must be a number, since start properties are assigned repeat values after swap and start properties can only be numbers.

                            // Set start properties as the EVALUATED repeat properties.
                            // This way we can just use repeat properties as storage for the yoyo function until it is swapped again.
                            this.startProperties[property] = this.repeatProperties[property].call(null, this.endProperties[property]);
                            continue;
                        }
                    }
                    // If it's a dynamic end value, update the start state to the cumulative state.
                    // But yoyo should not be cumulative, hence the else...
                    else if (typeof this.endProperties[property] === 'function')
                    {
                        this.repeatProperties[property] += this.endProperties[property].call(null, this.repeatProperties[property]);
                    }

                    // Set start properties as repeat properties...
                    this.startProperties[property] = this.repeatProperties[property];
                }

                if (this._yoyo)
                {
                    this.reversed = !this.reversed;
                }

                if (this._repeatDelay)
                {
                    this.startTime = time + this._repeatDelay;
                }
                else
                {
                    this.startTime = time + this._startDelay;
                }

                this.emit('repeat', this.target);

                return true;
            }
            else
            {
                this.active = false;
                
                this.emit('complete', this.target);

                for(const next of this.nexts)
                {
                    next.start(this.startTime + this._duration);
                }

                return false;
            }
        }

        return true;
    }

    getTweenValue(start, end, progress)
    {
        let result;
        if (Array.isArray(end))
        {
            result = this.interpolationFunction(end, progress);
        }
        else if (typeof end === 'function')
        {
            result = end.call(null, start);
        }
        else
        {
            result = end;
        }
        
        if (typeof result === 'number')
        {
            return start + (result - start) * progress;
        }
        else
        {
            throw new Error('Unable to tween unknown end property type.');
        }
    }

    ease(func)
    {
        if (typeof func === 'string')
        {
            this.easingFunction = Easing.getFunctionByName(func);
        }
        else
        {
            this.easingFunction = func;
        }
        return this;
    }

    interpolate(func)
    {
        if (typeof func === 'string')
        {
            this.interpolationFunction = Interpolation.getFunctionByName(func);
        }
        else
        {
            this.interpolationFunction = func;
        }
        return this;
    }

    repeat(count = Infinity, repeatDelay = undefined)
    {
        this._repeat = count;
        if (typeof repeatDelay !== 'undefined') this._repeatDelay = repeatDelay;
        return this;
    }

    delay(time = 1000, repeatDelay = undefined)
    {
        this._startDelay = time;
        if (typeof repeatDelay === 'undefined') this._repeatDelay = repeatDelay;
        return this;
    }

    yoyo(value = true)
    {
        this._yoyo = value;
        if (this._repeat <= 0) this._repeat = 1;
        return this;
    }

    setDuration(value)
    {
        this._duration = value;
        return this;
    }

    setRepeatDelay(time)
    {
        this._repeatDelay = time;
        return this;
    }
}

Eventable.mixin(Tween);

export default Tween;