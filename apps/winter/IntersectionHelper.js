// SOURCE: https://noonat.github.io/intersect/#aabb-vs-aabb

export function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

export function createAABB(x, y, width, height)
{
    return {
        x, y,
        rx: width / 2,
        ry: height / 2,
    };
}

export function testAABB(a, b)
{
    if (Math.abs(a.x - b.x) > (a.rx + b.rx)) return false;
    if (Math.abs(a.y - b.y) > (a.ry + b.ry)) return false;
    return true;
}

export function intersectAABB(out, a, b)
{
    let dx = b.x - a.x;
    let px = (b.rx + a.rx) - Math.abs(dx);
    if (px <= 0) return null;

    let dy = b.y - a.y;
    let py = (b.ry + a.ry) - Math.abs(dy);
    if (py <= 0) return null;

    if (px < py)
    {
        let sx = Math.sign(dx);
        out.dx = px * sx;
        out.dy = 0;
        out.nx = sx;
        out.ny = 0;
        out.x = a.x + (a.rx * sx);
        out.y = b.y;
    }
    else
    {
        let sy = Math.sign(dy);
        out.dx = 0;
        out.dy = py * sy;
        out.nx = 0;
        out.ny = sy;
        out.x = b.x;
        out.y = a.y + (a.ry * sy);
    }

    return out;
}

export function intersectPoint(out, a, x, y)
{
    let dx = x - a.x;
    let px = a.rx - Math.abs(dx);
    if (px <= 0) return null;

    let dy = y - a.y;
    let py = a.ry - Math.abs(dy);
    if (py <= 0) return null;

    if (px < py)
    {
        let sx = Math.sign(dx);
        out.dx = px * sx;
        out.dy = 0;
        out.nx = sx;
        out.ny = 0;
        out.x = a.x + (a.rx * sx);
        out.y = y;
    }
    else
    {
        let sy = Math.sign(dy);
        out.dx = 0;
        out.dy = py * sy;
        out.nx = 0;
        out.ny = sy;
        out.x = x;
        out.y = a.y + (a.ry * sy);
    }

    return out;
}

export function intersectSegment(out, a, x, y, dx, dy, px = 0, py = 0)
{
    let scaleX = 1.0 / delta.x;
    let scaleY = 1.0 / delta.y;
    let signX = Math.sign(scaleX);
    let signY = Math.sign(scaleY);
    let nearTimeX = (a.x - signX * (a.rx + px) - x) * scaleX;
    let nearTimeY = (a.y - signY * (a.ry + py) - y) * scaleY;
    let farTimeX = (a.x + signX * (a.rx + px) - x) * scaleX;
    let farTimeY = (a.y + signY * (a.ry + py) - y) * scaleY;
    if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;

    let nearTime = nearTimeX > nearTimeY ? nearTimeX : nearTimeY;
    let farTime = farTimeX < farTimeY ? farTimeX : farTimeY;
    if (nearTime >= 1 || farTime <= 0) return null;

    let time = clamp(nearTime, 0, 1);
    let hitdx = (1.0 - time) * -dx;
    let hitdy = (1.0 - time) * -dy;
    let hitx = x + dx * time;
    let hity = y + dy * time;

    if (nearTimeX > nearTimeY)
    {
        out.time = time;
        out.nx = -signX;
        out.ny = 0;
        out.dx = hitdx;
        out.dy = hitdy;
        out.x = hitx;
        out.y = hity;
    }
    else
    {
        out.time = time;
        out.nx = 0;
        out.ny = -signY;
        out.dx = hitdx;
        out.dy = hitdy;
        out.x = hitx;
        out.y = hity;
    }

    return out;
}

export function sweepAABB(out, a, b, dx, dy)
{
    let hit = intersectSegment({}, a, b.x, b.y, dx, dy, b.rx, b.ry);

    if (hit)
    {
        let time = clamp(hit.time - Number.EPSILON, 0, 1);
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
        hit.x = clamp(hit.x + normaldx * b.rx, a.x - a.rx, a.x + a.rx);
        hit.y = clamp(hit.y + normaldy * b.ry, a.y - a.ry, a.y + a.ry);

        out.time = time;
        out.x = b.x + dx * time;
        out.y = b.y + dy * time;
        out.hit = hit;
    }
    else
    {
        out.time = 1;
        out.x = b.x + dx;
        out.y = b.y + dy;
        out.hit = hit;
    }

    return out;
}

export function sweepInto(out, a, staticColliders, dx, dy)
{
    let tmp = {};

    out.time = 1;
    out.x = a.x + dx;
    out.y = a.y + dy;

    let nearest = out;
    for(let i = 0, l = staticColliders.length; i < l; ++i)
    {
        let current = sweepAABB(tmp, a, staticColliders[i], dx, dy);
        if (current.time < nearest.time)
        {
            nearest.time = current.time;
            nearest.x = current.x;
            nearest.y = current.y;
            nearest.hit = current.hit;
        }
    }
    return out;
}
