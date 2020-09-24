const EPSILON = 1e-8;

/**
 * @typedef AxisAlignedBoundingBox
 * @property {Number} x
 * @property {Number} y
 * @property {Number} rx
 * @property {Number} ry
 */

/**
 * @typedef HitResult
 * @property {Number} x
 * @property {Number} y
 * @property {Number} dx
 * @property {Number} dy
 * @property {Number} nx
 * @property {Number} ny
 * @property {Number} time
 */

/**
 * @typedef SweepResult
 * @property {Number} x
 * @property {Number} y
 * @property {Number} time
 * @property {AxisAlignedBoundingBox} other
 * @property {HitResult} hit
 */

/**
 * Clamp the value between the given range.
 * 
 * @param {Number} value The value to be clamped.
 * @param {Number} min The minimum possible value, inclusive.
 * @param {Number} max The maximum possible value, inclusive.
 * @returns {Number} The clamped value.
 */
function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

/**
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} dx 
 * @param {Number} dy 
 * @param {Number} nx 
 * @param {Number} ny 
 * @param {Number} time 
 * @returns {HitResult}
 */
function createHitResult(x, y, dx, dy, nx, ny, time)
{
    return {
        x, y,
        dx, dy,
        nx, ny,
        time,
    };
}

/**
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} time 
 * @param {HitResult} hit 
 * @returns {SweepResult}
 */
function createSweepResult(x, y, time, hit)
{
    return {
        x, y,
        time,
        hit,
    };
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rx
 * @param {Number} ry
 * @returns {AxisAlignedBoundingBox}
 */
export function createAxisAlignedBoundingBox(x, y, rx, ry)
{
    return {
        x, y,
        rx, ry,
    };
}

/**
 * Tests and gets the intersection info of a static axis-aligned bounding
 * box against a point.
 * 
 * @param {AxisAlignedBoundingBox} a The box to test against.
 * @param {Number} x The x position of the point.
 * @param {Number} y The y position of the point.
 * @returns {HitResult|null} The hit result info.
 */
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

/**
 * Tests and gets the intersection info of a static axis-aligned bounding
 * box against a segment.
 * 
 * @param {AxisAlignedBoundingBox} a The box to test against.
 * @param {Number} x The x position of the root of the segment.
 * @param {Number} y The y position of the root of the segment.
 * @param {Number} dx The x-axis delta from the root of the segment.
 * @param {Number} dy The y-axis delta from the root of the segment.
 * @param {Number} px The x-axis padding away from the segment.
 * @param {Number} py The y-axis padding away from the segment.
 * @returns {HitResult|null} The hit result info.
 */
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

/**
 * Tests and gets the intersection info of two static axis-aligned bounding
 * boxes.
 * 
 * @param {AxisAlignedBoundingBox} a The box to test against.
 * @param {AxisAlignedBoundingBox} b The other box.
 * @returns {HitResult|null} The hit result info.
 */
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

/**
 * Tests collision of a moving axis-aligned bounding box against other
 * boxes.
 * 
 * @param {AxisAlignedBoundingBox} a The box to test against.
 * @param {Number} dx The x-axis motion of the box.
 * @param {Number} dy The y-axis motion of the box.
 * @param {Array<AxisAlignedBoundingBox>} others The other boxes.
 * @returns {SweepResult} The collision result info.
 */
export function sweepInto(a, dx, dy, others)
{
    let result = createSweepResult(a.x + dx, a.y + dy, 1, null);
    let temp = createSweepResult(0, 0, 0, null);
    for(let b of others)
    {
        if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON)
        {
            let hit = intersectAxisAlignedBoundingBox(b, a);
            if (hit) hit.time = 0;
            temp.x = a.x;
            temp.y = a.y;
            temp.time = hit ? 0 : 1;
            temp.other = b;
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
                temp.other = b;
                temp.hit = hit;
            }
            else
            {
                temp.x = a.x + dx;
                temp.y = a.y + dy;
                temp.time = 1;
                temp.other = null;
                temp.hit = null;
            }
        }

        if (temp.time <= result.time)
        {
            result.time = temp.time;
            result.x = temp.x;
            result.y = temp.y;
            result.other = temp.other;
            result.hit = temp.hit;
        }
    }
    return result;
}
