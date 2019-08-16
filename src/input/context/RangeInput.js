import Input from './Input.js';

class RangeInput extends Input
{
    constructor(name, eventKey, min, max)
    {
        super(name, eventKey);

        if (typeof max !== 'number' || typeof min !== 'number')
        {
            throw new Error('Range bounds for input not specified');
        }
    
        if (max < min)
        {
            throw new Error('Max range must be greater than min range');
        }

        this.min = min;
        this.max = max;

        const normal = max - min;
        if (normal == 0)
        {
            throw new Error('Range of input cannot be zero');
        }
        this.normal = normal;
    }

    /** @override */
    update(source, key, event, value)
    {
        if (typeof value !== 'number')
        {
            value = value ? 1 : 0;
        }
        return this.normalize(value);
    }

    normalize(value)
    {
      return (value - this.min) / this.normal;
    }
}

export default RangeInput;
