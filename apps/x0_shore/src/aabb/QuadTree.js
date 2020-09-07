// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

/**
 * @typedef Bounds
 * @property {Number} x The center x position.
 * @property {Number} y The center y position.
 * @property {Number} rx The half width of the bounds.
 * @property {Number} ry The half height of the bounds.
 */

/**
 * Creates bounds for the given dimensions.
 * 
 * @param {Number} x The center x position.
 * @param {Number} y The center y position.
 * @param {Number} rx The half width of the bounds.
 * @param {Number} ry The half height of the bounds.
 * @returns {Bounds} The newly created bounds.
 */
export function createBounds(x, y, rx, ry)
{
    return { x, y, rx, ry };
}

const MAX_OBJECTS = 10;
const MAX_LEVELS = 5;

/**
 * A quadtree to help your sort boxes by proximity (in quadrants). Usually, this is used
 * like this:
 * 1. Clear the tree to be empty.
 * 2. Add all the boxes. They should be in the shape of {@link Bounds}.
 * 3. For each target box you want to check for, call {@link retrieve()}.
 * 4. The previous function should return a list of potentially colliding boxes. This is
 * where you should use a more precise intersection test to accurately determine if the
 * result is correct.
 * 
 * ```js
 * // Here is an example
 * quadTree.clear();
 * quadTree.insertAll(boxes);
 * let out = [];
 * for(let box of boxes)
 * {
 *   quadTree.retrieve(box, out);
 *   for(let other of out)
 *   {
 *     // Found a potential collision between box and other.
 *     // Run your collision detection algorithm for them here.
 *   }
 *   out.length = 0;
 * }
 * ```
 */
export class QuadTree
{
    /**
     * Constructs an empty quadtree.
     * 
     * @param {Number} [level] The root level for this tree.
     * @param {Bounds} [bounds] The bounds of this tree.
     */
    constructor(
        level = 0,
        bounds = createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
    {
        this.level = level;
        this.bounds = bounds;

        this.boxes = [];
        this.nodes = new Array(4);
    }

    /**
     * Inserts all the boxes into the tree.
     * 
     * @param {Array<Buonds>} boxes A list of boxes.
     */
    insertAll(boxes)
    {
        for(let box of boxes)
        {
            this.insert(box);
        }
    }

    /**
     * Inserts the box into the tree.
     * 
     * @param {Bounds} box A box.
     */
    insert(box)
    {
        let hasNode = this.nodes[0];

        if (hasNode)
        {
            let quadIndex = this.findQuadIndex(box);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].insert(box);
                return;
            }
        }

        this.boxes.push(box);

        if (this.boxes.length > MAX_OBJECTS && this.level < MAX_LEVELS)
        {
            if (!hasNode) this.split();

            for(let i = this.boxes.length - 1; i >= 0; --i)
            {
                let otherBox = this.boxes[i];
                let quadIndex = this.findQuadIndex(otherBox);
                if (quadIndex >= 0)
                {
                    this.boxes.splice(i, 1);
                    this.nodes[quadIndex].insert(otherBox);
                }
            }
        }
    }

    /**
     * Retrieves all the near boxes for the target.
     * 
     * @param {Bounds} box The target box to get all near boxes for.
     * @param {Array<Bounds>} [out=[]] The list to append results to.
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.includeSelf=false] Whether to include the
     * target in the result list.
     * @returns {Array<Bounds>} The appended list of results.
     */
    retrieve(box, out = [], opts = {})
    {
        const { includeSelf = false } = opts;

        if (this.nodes[0])
        {
            let quadIndex = this.findQuadIndex(box);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].retrieve(box, out);
            }
        }

        let boxes = this.boxes;
        if (!includeSelf)
        {
            // Append all elements before the index (or none, if not found)...
            let targetIndex = boxes.indexOf(box);
            for(let i = 0; i < targetIndex; ++i)
            {
                out.push(boxes[i]);
            }
            // Append all elements after the index (or from 0, if not found)...
            let length = boxes.length;
            for(let i = targetIndex + 1; i < length; ++i)
            {
                out.push(boxes[i]);
            }
        }
        else
        {
            out.push(...boxes);
        }
        return out;
    }

    /**
     * Removes all boxes form the tree.
     */
    clear()
    {
        this.boxes.length = 0;

        for(let i = 0; i < this.nodes.length; ++i)
        {
            let node = this.nodes[i];
            if (node)
            {
                node.clear();
                this.nodes[i] = null;
            }
        }
    }

    /** @private */
    split()
    {
        let { x, y, rx, ry } = this.bounds;
        let nextLevel = this.level + 1;

        let ChildConstructor = this.constructor;

        this.nodes[0] = new ChildConstructor(nextLevel, createBounds(x + rx, y, rx, ry));
        this.nodes[1] = new ChildConstructor(nextLevel, createBounds(x, y, rx, ry));
        this.nodes[2] = new ChildConstructor(nextLevel, createBounds(x, y + ry, rx, ry));
        this.nodes[3] = new ChildConstructor(nextLevel, createBounds(x + rx, y + ry, rx, ry));
    }

    /** @private */
    findQuadIndex(box)
    {
        const { x: bx, y: by, rx: brx, ry: bry } = this.bounds;
        const midpointX = bx + brx;
        const midpointY = by + bry;

        const { x, y, rx, ry } = box;
        const isTop = y < midpointY && y + ry * 2 < midpointY;
        const isBottom = y > midpointY;
        const isLeft = x < midpointX && x + rx * 2 < midpointX;
        const isRight= x > midpointX;

        let index = -1;
        if (isLeft)
        {
            if (isTop)
            {
                index = 1;
            }
            else if (isBottom)
            {
                index = 2;
            }
        }
        else if (isRight)
        {
            if (isTop)
            {
                index = 0;
            }
            else if (isBottom)
            {
                index = 3;
            }
        }

        return index;
    }
}
