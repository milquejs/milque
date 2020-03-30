import { Mask } from './Mask.js';

export class CircleMask extends Mask
{
    constructor(x, y, radius)
    {
        super();
        
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(ctx)
    {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.arc(-this.x, -this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}
