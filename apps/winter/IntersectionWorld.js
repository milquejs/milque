import { resolveIntersections, computeIntersections } from './IntersectionResolver.js';

export function createIntersectionWorld()
{
    return {
        dynamics: [],
        masks: [],
        statics: [],
        update(dt)
        {
            resolveIntersections(this.dynamics, this.statics, dt);
            computeIntersections(this.masks, this.statics);
        },
        render(ctx)
        {
            ctx.save();
            {
                // Draw static colliders.
                ctx.strokeStyle = 'green';
                for(let collider of this.statics)
                {
                    ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                }

                // Draw dynamic colliders.
                ctx.strokeStyle = 'lime';
                for(let collider of this.dynamics)
                {
                    ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                }

                // Draw mask colliders.
                ctx.strokeStyle = 'blue';
                for(let collider of this.masks)
                {
                    switch(collider.type)
                    {
                        case 'point':
                            ctx.save();
                            {
                                ctx.fillStyle = 'blue';
                                ctx.fillRect(collider.x, collider.y, 1, 1);
                            }
                            ctx.restore();
                            break;
                        case 'segment':
                            ctx.beginPath();
                            ctx.moveTo(collider.x, collider.y);
                            ctx.lineTo(collider.x + collider.dx, collider.y + collider.dy);
                            ctx.stroke();
                            break;
                        case 'aabb':
                            ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                            break;
                    }
                }
            }
            ctx.restore();
        }
    };
}
