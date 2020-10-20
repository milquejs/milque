import { Mask } from './Mask.js';

export class BoxMask extends Mask
{
    constructor(x, y, width, height)
    {
        super();
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx)
    {
        ctx.strokeStyle = 'green';
        ctx.strokeRect(-this.x, -this.y, this.width, this.height);
    }
}
