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

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    uuid: uuid,
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

const TOP_INDEX = 0;

// NOTE: Uses a binary heap to sort.
class PriorityQueue
{
    constructor(comparator)
    {
        this._heap = [];
        this._comparator = comparator;
    }

    get size() { return this._heap.length; }

    clear()
    {
        this._heap.length = 0;
    }

    push(...values)
    {
        for (const value of values)
        {
            this._heap.push(value);
            this._shiftUp();
        }
    }

    pop()
    {
        const result = this.peek();
        let bottom = bottomIndex(this);
        if (bottom > TOP_INDEX)
        {
            this._swap(TOP_INDEX, bottom);
        }
        this._heap.pop();
        this._shiftDown();
        return result;
    }

    /** Replaces the top value with the new value. */
    replace(value)
    {
        const result = this.peek();
        this._heap[TOP_INDEX] = value;
        this._shiftDown();
        return result;
    }

    peek()
    {
        return this._heap[TOP_INDEX];
    }

    _compare(i, j)
    {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j)
    {
        let result = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = result;
    }

    _shiftUp()
    {
        let node = this._heap.length - 1;
        let nodeParent;
        while (node > TOP_INDEX && this._compare(node, nodeParent = parentIndex(node)))
        {
            this._swap(node, nodeParent);
            node = nodeParent;
        }
    }

    _shiftDown()
    {
        const length = this._heap.length;
        let node = TOP_INDEX;
        let nodeMax;

        let nodeLeft = leftIndex(node);
        let flagLeft = nodeLeft < length;
        let nodeRight = rightIndex(node);
        let flagRight = nodeRight < length;

        while ((flagLeft && this._compare(nodeLeft, node))
            || (flagRight && this._compare(nodeRight, node)))
        {
            nodeMax = (flagRight && this._compare(nodeRight, nodeLeft)) ? nodeRight : nodeLeft;
            this._swap(node, nodeMax);
            node = nodeMax;

            nodeLeft = leftIndex(node);
            flagLeft = nodeLeft < length;
            nodeRight = rightIndex(node);
            flagRight = nodeRight < length;
        }
    }

    values()
    {
        return this._heap;
    }

    [Symbol.iterator]()
    {
        return this._heap[Symbol.iterator]();
    }
}

function bottomIndex(queue)
{
    return queue._heap.length - 1;
}

function parentIndex(i)
{
    return ((i + 1) >>> 1) - 1;
}

function leftIndex(i)
{
    return (i << 1) + 1;
}

function rightIndex(i)
{
    return (i + 1) << 1;
}

export { PriorityQueue, index as Utils };
