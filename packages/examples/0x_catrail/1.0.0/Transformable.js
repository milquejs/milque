// Goals:
// Should be easy to use and write
// Should support class-format
// Should support function-format
// Should be pool-able

export class Transformable
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    copy(values)
    {
        this.x = values.x;
        this.y = values.y;
    }

    reset() {}
}

export function Transformable(x = 0, y = 0)
{
    return {
        x,
        y,
    };
}

const Transformable = {
    create()
    {
        return {
            x: 0,
            y: 0,
        };
    },
    copy(dst, values)
    {
        dst.x = values.x;
        dst.y = values.y;
    },
    reset()
    {
        dst.x = 0;
        dst.y = 0;
    }
};
