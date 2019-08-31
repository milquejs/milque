import Input from './Input.js';

class RangeInput extends Input
{
    constructor(name, eventKey, fromMin, fromMax, toMin = 0, toMax = 1)
    {
        super(name, eventKey);

        if (typeof fromMax !== 'number' || typeof fromMin !== 'number' || typeof toMax !== 'number' || typeof toMin !== 'number')
        {
            throw new Error('Range bounds for input not specified');
        }
    
        if (fromMax < fromMin || toMax < toMin)
        {
            throw new Error('Max range must be greater than min range');
        }

        if (fromMax === fromMin || toMax === toMin)
        {
            throw new Error('Range of input cannot be zero');
        }

        this.fromMin = fromMin;
        this.fromMax = fromMax;
        this.fromNormal = fromMax - fromMin;

        this.toMin = toMin;
        this.toMax = toMax;
        this.toNormal = toMax - toMin;
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
      return ((value - this.fromMin) / this.fromNormal) * this.toNormal + this.toMin;
    }
}

export default RangeInput;
