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

    /** @private */
    _compare(i, j)
    {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    /** @private */
    _swap(i, j)
    {
        let result = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = result;
    }

    /** @private */
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

    /** @private */
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

var PriorityQueue$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PriorityQueue: PriorityQueue
});

export { PriorityQueue$1 as P, PriorityQueue as a };
