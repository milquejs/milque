/**
 * Generates a uuid v4.
 * 
 * @param {number} a The placeholder (serves for recursion within function).
 * @returns {string} The universally unique id.
 */
function uuid(a = undefined)
{
    // https://gist.github.com/jed/982883
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
}

function clampRange(value, min, max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function withinRadius(from, to, radius)
{
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius
}

function lerp(a, b, dt)
{
    return a + (b - a) * dt;
}

function distance2D(from, to)
{
    let dx = to.x - from.x;
    let dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function direction2D(from, to)
{
    let dx = to.x - from.x;
    let dy = to.y - from.y;
    return Math.atan2(dy, dx);
}

function lookAt2D(radians, target, dt)
{
    let step = cycleRange(target - radians, -Math.PI, Math.PI);
    return clampRange(radians + step, radians - dt, radians + dt);
}

function cycleRange(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}

function randomHexColor()
{
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function loadImage(url)
{
    let image = new Image();
    image.src = url;
    return image;
}

function clearScreen(ctx, width, height)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

function drawText(ctx, text, x, y, radians = 0, fontSize = 16, color = 'white')
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    if (radians) ctx.rotate(-radians);
    ctx.translate(-x, -y);
}

function drawBox(ctx, x, y, radians = 0, w = 16, h = w, color = 'white', outline = false)
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    if (!outline)
    {
        ctx.fillStyle = color;
        ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    else
    {
        ctx.strokeStyle = color;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
    }
    if (radians) ctx.rotate(-radians);
    ctx.translate(-x, -y);
}

function intersectBox(a, b)
{
    return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
        (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
}

function applyMotion(entity, inverseFrictionX = 1, inverseFrictionY = inverseFrictionX)
{
    if (inverseFrictionX !== 1)
    {
        entity.dx *= inverseFrictionX;
    }
    if (inverseFrictionY !== 1)
    {
        entity.dy *= inverseFrictionY;
    }
    
    entity.x += entity.dx;
    entity.y += entity.dy;
}

function onDOMLoaded(listener)
{
    window.addEventListener('DOMContentLoaded', listener);
}

function drawCircle(ctx, x, y, radius = 16, color = 'white', outline = false)
{
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (outline) ctx.stroke();
    else ctx.fill();
}

/**
 * @module Util
 */

var _default = /*#__PURE__*/Object.freeze({
    __proto__: null,
    uuid: uuid,
    clampRange: clampRange,
    withinRadius: withinRadius,
    lerp: lerp,
    distance2D: distance2D,
    direction2D: direction2D,
    lookAt2D: lookAt2D,
    cycleRange: cycleRange,
    randomHexColor: randomHexColor,
    loadImage: loadImage,
    clearScreen: clearScreen,
    drawText: drawText,
    drawBox: drawBox,
    intersectBox: intersectBox,
    applyMotion: applyMotion,
    onDOMLoaded: onDOMLoaded,
    drawCircle: drawCircle
});

export { _default as Util };
