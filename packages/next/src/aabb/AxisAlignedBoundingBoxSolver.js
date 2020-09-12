const EPSILON = 1e-8;

function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function createHitResult(x, y, dx, dy, nx, ny, time)
{
    return {
        x, y,
        dx, dy,
        nx, ny,
        time,
    };
}

function createCollisionResult(x, y, time, hit)
{
    return {
        x, y,
        time,
        hit,
    };
}

export function intersectPoint(a, x, y)
{
    let dx = x - a.x;
    let px = a.rx - Math.abs(dx);
    if (px < 0) return null;
    let dy = y - a.y;
    let py = a.ry - Math.abs(dy);
    if (py < 0) return null;
    if (px < py)
    {
        let sx = Math.sign(dx);
        return createHitResult(a.x + (a.rx * sx), y, px * sx, 0, sx, 0, 0);
    }
    else
    {
        let sy = Math.sign(dy);
        return createHitResult(x, a.y + (a.ry * sy), 0, py * sy, 0, sy, 0);
    }
}

export function intersectSegment(a, x, y, dx, dy, px = 0, py = 0)
{
    if (Math.abs(dx) < EPSILON
        && Math.abs(dy) < EPSILON
        && px === 0
        && py === 0) return intersectPoint(a, x, y);
    let arx = a.rx;
    let ary = a.ry;
    let bpx = px;
    let bpy = py;
    let scaleX = 1.0 / (dx || EPSILON);
    let scaleY = 1.0 / (dy || EPSILON);
    let signX = Math.sign(scaleX);
    let signY = Math.sign(scaleY);
    let nearTimeX = (a.x - signX * (arx + bpx) - x) * scaleX;
    let nearTimeY = (a.y - signY * (ary + bpy) - y) * scaleY;
    let farTimeX = (a.x + signX * (arx + bpx) - x) * scaleX;
    let farTimeY = (a.y + signY * (ary + bpy) - y) * scaleY;
    if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;
    let nearTime = Math.max(nearTimeX, nearTimeY);
    let farTime = Math.min(farTimeX, farTimeY);
    if (nearTime > 1 || farTime < 0) return null;
    let time = clamp(nearTime, 0, 1);
    let hitdx = (1.0 - time) * -dx;
    let hitdy = (1.0 - time) * -dy;
    let hitx = x + dx * time;
    let hity = y + dy * time;
    if (nearTimeX > nearTimeY)
    {
        return createHitResult(hitx, hity, hitdx, hitdy, -signX, 0, time);
    }
    else
    {
        return createHitResult(hitx, hity, hitdx, hitdy, 0, -signY, time);
    }
}

export function intersectAxisAlignedBoundingBox(a, b)
{
    let dx = b.x - a.x;
    let px = (b.rx + a.rx) - Math.abs(dx);
    if (px < 0) return null;
    let dy = b.y - a.y;
    let py = (b.ry + a.ry) - Math.abs(dy);
    if (py < 0) return null;
    if (px < py)
    {
        let sx = Math.sign(dx);
        return createHitResult(a.x + (a.rx * sx), b.y, px * sx, 0, sx, 0, 0);
    }
    else
    {
        let sy = Math.sign(dy);
        return createHitResult(b.x, a.y + (a.ry * sy), 0, py * sy, 0, sy, 0);
    }
}

export function sweepInto(a, dx, dy, others)
{
    let result = createCollisionResult(a.x + dx, a.y + dy, 1, null);
    let temp = createCollisionResult(0, 0, 0, null);
    for(let i = 0, l = others.length; i < l; ++i)
    {
        let b = others[i];

        if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON)
        {
            let hit = intersectAxisAlignedBoundingBox(b, a);
            if (hit) hit.time = 0;
            temp.x = a.x;
            temp.y = a.y;
            temp.time = hit ? 0 : 1;
            temp.hit = hit;
        }
        else
        {
            let hit = intersectSegment(b, a.x, a.y, dx, dy, a.rx, a.ry);
            if (hit)
            {
                let time = clamp(hit.time, 0, 1);
                let length = Math.sqrt(dx * dx + dy * dy);
                let normaldx;
                let normaldy;
                if (length)
                {
                    normaldx = dx / length;
                    normaldy = dy / length;
                }
                else
                {
                    normaldx = 0;
                    normaldy = 0;
                }
                hit.x = clamp(hit.x + normaldx * a.rx, b.x - b.rx, b.x + b.rx);
                hit.y = clamp(hit.y + normaldy * a.ry, b.y - b.ry, b.y + b.ry);
                temp.x = a.x + dx * time;
                temp.y = a.y + dy * time;
                temp.time = time;
                temp.hit = hit;
            }
            else
            {
                temp.x = a.x + dx;
                temp.y = a.y + dy;
                temp.time = 1;
                temp.hit = null;
            }
        }

        if (temp.time <= result.time)
        {
            result.time = temp.time;
            result.x = temp.x;
            result.y = temp.y;
            result.hit = temp.hit;
        }
    }
    return result;
}
