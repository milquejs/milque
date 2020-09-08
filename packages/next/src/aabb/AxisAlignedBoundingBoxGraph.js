import { QuadTree } from './QuadTree.js';

/**
 * @typedef {Function} TestFunction
 * @param {AxisAlignedBoundingBox} a
 * @param {AxisAlignedBoundingBox} b
 * @returns {Boolean} Whether or not the passed-in boxes
 * should be considered as possibly colliding.
 */

/**
 * @typedef CollisionResult
 * @property {AxisAlignedBoundingBox} box
 * @property {AxisAlignedBoundingBox} other
 */

/**
 * The property key for masks to keep count of how many are
 * still available.
 */
const MASK_COUNT = Symbol('maskCount');

/** An axis-aligned graph for effeciently solving box collisions. */
export class AxisAlignedBoundingBoxGraph
{
    /**
     * Constructs an empty graph.
     * 
     * @param {Object} [opts={}] Any additional options.
     * @param {typeof AxisAlignedBoundingBox} [opts.boxConstructor=AxisAlignedBoundingBox]
     * The axis-aligned bounding box constructor that make up the graph.
     */
    constructor(opts = {})
    {
        this.boxConstructor = opts.boxConstructor || AxisAlignedBoundingBox;

        this.masks = new Map();
        this.boxes = new Set();

        // Used for constant lookup when updating dynamic masks.
        this.dynamics = new Set();
        // Used for efficiently pruning objects when solving.
        this.quadtree = new QuadTree();
    }

    add(owner, maskName, maskValues = {})
    {
        let mask = {
            owner,
            box: null,
            get: null,
        };

        if (!this.masks.has(owner))
        {
            this.masks.set(owner, {
                [MASK_COUNT]: 1,
                [maskName]: mask,
            });
        }
        else if (!(maskName in this.masks.get(owner)))
        {
            let ownedMasks = this.masks.get(owner);
            ownedMasks[maskName] = mask;
            ownedMasks[MASK_COUNT]++;
        }
        else
        {
            throw new Error(`Mask ${maskName} already exists for owner.`);
        }

        if (Array.isArray(maskValues))
        {
            const x = maskValues[0] || 0;
            const y = maskValues[1] || 0;
            const rx = (maskValues[2] / 2) || 0;
            const ry = (maskValues[3] / 2) || 0;

            let box = new (this.boxConstructor)(this, owner, x, y, rx, ry);
            this.boxes.add(box);

            mask.box = box;
        }
        else if (typeof maskValues === 'object')
        {
            let x = maskValues.x || 0;
            let y = maskValues.y || 0;
            let rx = maskValues.rx || (maskValues.width / 2) || 0;
            let ry = maskValues.ry || (maskValues.height / 2) || 0;

            if (typeof owner === 'object')
            {
                if (!x) x = owner.x || 0;
                if (!y) y = owner.y || 0;
                if (!rx) rx = (owner.width / 2) || 0;
                if (!ry) ry = (owner.height / 2) || 0;
            }
            
            let box = new (this.boxConstructor)(this, owner, x, y, rx, ry);
            this.boxes.add(box);

            mask.box = box;
            if ('get' in maskValues)
            {
                mask.get = maskValues.get;
                mask.get(box, owner);
                this.dynamics.add(mask);
            }
        }
        else if (typeof maskValues === 'function')
        {
            let box = new (this.boxConstructor)(this, owner, 0, 0, 0, 0);
            this.boxes.add(box);
            
            mask.box = box;
            mask.get = maskValues;
            maskValues.call(mask, box, owner);
            this.dynamics.add(mask);
        }
        else
        {
            throw new Error('Invalid mask option type.');
        }
    }

    remove(owner, maskName)
    {
        if (this.masks.has(owner))
        {
            let ownedMasks = this.masks.get(owner);
            let mask = ownedMasks[maskName];
            if (mask)
            {
                if (mask.get) this.dynamics.delete(mask);
                this.boxes.delete(mask.box);
                ownedMasks[maskName] = null;

                let count = --ownedMasks[MASK_COUNT];
                if (count <= 0)
                {
                    this.masks.delete(owner);
                }
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    get(owner, maskName)
    {
        if (this.masks.has(owner))
        {
            return this.masks.get(owner)[maskName];
        }
        else
        {
            return null;
        }
    }

    count(owner)
    {
        if (this.masks.has(owner))
        {
            return this.masks.get(owner)[MASK_COUNT];
        }
        else
        {
            return 0;
        }
    }

    clear()
    {
        this.boxes.clear();
        this.masks.clear();
        this.dynamics.clear();
        this.quadtree.clear();
    }

    /**
     * Forcibly updates the current graph to match the system for
     * the given initial options.
     * 
     * This is usually called automatically by {@link solve()} to
     * update the graph to get the current results, but could also
     * be called manually for more control.
     */
    update()
    {
        // Update boxes
        for(let mask of this.dynamics.values())
        {
            mask.get(mask.box, mask.owner);
        }
    }
    
    /**
     * Solves the current graph for collisions. Usually, you want
     * to call {@link update()} before this function to ensure the
     * boxes accurately reflect the current state.
     * 
     * @param {Boolean} [forceUpdate=true] Whether to update the
     * graph before solving it. If false, you must call {@link update()}
     * yourself to update the graph to the current state.
     * @param {Object} [opts={}] Any additional options.
     * @param {TestFunction} [opts.test] The custom tester function
     * to initially check if 2 objects can be colliding.
     * @returns {Array<CollisionResult>} The collisions found in the current graph.
     */
    solve(forceUpdate = true, out = [], opts = {})
    {
        const { test = testAxisAlignedBoundingBox } = opts;

        if (forceUpdate)
        {
            this.update();
        }

        let result = out;
        let boxes = this.boxes;
        let quadtree = this.quadtree;
        quadtree.clear();
        quadtree.insertAll(boxes);

        let others = [];
        for(let box of boxes)
        {
            quadtree.retrieve(box, others);
            for(let other of others)
            {
                if (test(box, other))
                {
                    const collision = createCollisionResult(box, other);
                    result.push(collision);
                }
            }
            others.length = 0;
        }
        return result;
    }
}

/**
 * Creates a collision result for the given boxes.
 * 
 * @param {AxisAlignedBoundingBox} a
 * @param {AxisAlignedBoundingBox} b
 * @returns {CollisionResult} The new collision result.
 */
function createCollisionResult(a, b)
{
    return {
        box: a,
        other: b,
    };
}

/**
 * A representative bounding box to keep positional and
 * dimensional metadata for any object in the
 * {@link AxisAlignedBoundingBoxGraph}.
 */
export class AxisAlignedBoundingBox
{
    constructor(aabbGraph, owner, x, y, rx, ry)
    {
        this.aabbGraph = aabbGraph;
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    setSize(width, height)
    {
        this.rx = width / 2;
        this.ry = height / 2;
        return this;
    }

    setHalfSize(rx, ry)
    {
        this.rx = rx;
        this.ry = ry;
        return this;
    }
}

/**
 * Tests whether either {@link AxisAlignedBoundingBox} intersect one another.
 * 
 * @param {AxisAlignedBoundingBox} a A box.
 * @param {AxisAlignedBoundingBox} b Another box in the same graph.
 * @returns {Boolean} If either box intersects the other.
 */
export function testAxisAlignedBoundingBox(a, b)
{
    return !(Math.abs(a.x - b.x) > (a.rx + b.rx))
        && !(Math.abs(a.y - b.y) > (a.ry + b.ry));
}
