import { intersectPoint, intersectSegment, intersectAABB, sweepInto, EPSILON } from './IntersectionHelper.js';

const MAX_SWEEP_RESOLUTION_ITERATIONS = 100;

export function computeIntersections(masks, statics = [])
{
    // Compute physics.
    for(let mask of masks)
    {
        switch(mask.type)
        {
            case 'point':
                mask.hit = null;
                for(let other of statics)
                {
                    mask.hit = intersectPoint({}, other, mask.x, mask.y);
                    if (mask.hit) break;
                }
                break;
            case 'segment':
                mask.hit = null;
                for(let other of statics)
                {
                    mask.hit = intersectSegment({}, other, mask.x, mask.y, mask.dx, mask.dy, mask.px, mask.py);
                    if (mask.hit) break;
                }
                break;
            case 'aabb':
                mask.hit = null;
                for(let other of statics)
                {
                    mask.hit = intersectAABB({}, other, mask);
                    if (mask.hit) break;
                }
                break;
        }
    }
}

export function resolveIntersections(dynamics, statics = [], dt = 1)
{
    // Do physics.
    for(let dynamic of dynamics)
    {
        let dx = dynamic.dx * dt;
        let dy = dynamic.dy * dt;
        
        let time = 0;
        let tmp = {};
        let sweep;
        
        let hit = null;
        let iterations = MAX_SWEEP_RESOLUTION_ITERATIONS;
        do
        {
            // Do detection.
            sweep = sweepInto(tmp, dynamic, statics, dx, dy);
    
            // Do resolution.
            dynamic.x = sweep.x - (Math.sign(dx) * EPSILON);
            dynamic.y = sweep.y - (Math.sign(dy) * EPSILON);
            time += sweep.time;
            if (sweep.hit)
            {
                dx += sweep.hit.nx * Math.abs(dx);
                dy += sweep.hit.ny * Math.abs(dy);
                hit = sweep.hit;
    
                if (Math.abs(dx) < EPSILON) dx = 0;
                if (Math.abs(dy) < EPSILON) dy = 0;
            }
        }
        while(time < 1 && --iterations >= 0);

        dynamic.dx = dx;
        dynamic.dy = dy;
        dynamic.hit = hit;
    }
}
