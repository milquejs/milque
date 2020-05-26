import { intersectPoint, intersectSegment } from './IntersectionHelper.js';

const MAX_SWEEP_RESOLUTION_ITERATIONS = 100;

export function computeIntersections(masks, statics = [])
{
    // Compute physics.
    for(let other of statics)
    {
        for(let mask of masks)
        {
            switch(mask.type)
            {
                case 'point':
                    mask.hit = intersectPoint({}, other, mask.x, mask.y);
                    break;
                case 'segment':
                    mask.hit = intersectSegment({}, other, mask.x, mask.y, mask.dx, mask.dy, mask.px, mask.py);
                    break;
                case 'aabb':
                    mask.hit = intersectAABB({}, other, mask);
                    break;
            }
        }
    }
}

export function resolveIntersections(dynamics, statics = [])
{
    // Do physics.
    for(let dynamic of dynamics)
    {
        let dx = dynamic.dx;
        let dy = dynamic.dy;
        
        let time = 0;
        let tmp = {};
        let sweep;
        
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
                dx += sweep.hit.nx * dx;
                dy += sweep.hit.ny * dy;
    
                if (Math.abs(dx) < EPSILON) dx = 0;
                if (Math.abs(dy) < EPSILON) dy = 0;
            }
        }
        while(time < 1 && --iterations >= 0);

        dynamic.dx = dx;
        dynamic.dy = dy;
    }
}
