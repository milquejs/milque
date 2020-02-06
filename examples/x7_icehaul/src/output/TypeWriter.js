const HARD_PUNCTUATION_PATTERN = /[.!:]/;
const SOFT_PUNCTUATION_PATTERN = /[,;]/;
const WHITESPACE_PATTERN = /\s/;

class TypeWriter
{
    constructor(opts = {})
    {
        this.stream = opts.stream || process.stdout;
        this.speed = opts.speed || 15;
    }

    async write(message)
    {
        return await (new Promise(resolve => this._begin(message, resolve)));
    }

    _begin(message, callback)
    {
        let ctx = {
            callback,
            message,
            index: 0,
            next: 1,
            ticks: 0,

            oninput: null,
            oninterval: null,
            intervalHandle: null,
        };
        ctx.oninput = this._onInputData.bind(this, ctx);
        ctx.oninterval = this._onInterval.bind(this, ctx);
        
        let stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.on('data', ctx.oninput);

        ctx.intervalHandle = setInterval(ctx.oninterval, this.speed);
    }

    _end(ctx)
    {
        clearInterval(ctx.intervalHandle);

        let stdin = process.stdin;
        stdin.off('data', ctx.oninput);
        stdin.pause();
        stdin.setRawMode(false);

        if (ctx.callback) ctx.callback();
    }

    _onInterval(ctx)
    {
        let message = ctx.message;
        let index = ctx.index;
        let next = ctx.next;
        if (index >= message.length)
        {
            this._end(ctx);
        }
        else
        {
            if (ctx.ticks > 0)
            {
                --ctx.ticks;
                return;
            }

            let str = message.substring(index, next);
            this.stream.write(str);

            ctx.index = next;
            ctx.next = next + 1;

            if (str.length === 1)
            {
                if (HARD_PUNCTUATION_PATTERN.test(str))
                {
                    ctx.ticks = 6;
                }
                else if (SOFT_PUNCTUATION_PATTERN.test(str))
                {
                    ctx.ticks = 2;
                }
                else
                {
                    ctx.ticks = 0;
                }
            }
        }
    }

    _onInputData(ctx, key)
    {
        // NOTE: Press any key
        ctx.next = ctx.message.length;
    }
}

module.exports = { TypeWriter };
