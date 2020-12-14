import { QuadTree } from './QuadTree.js';
import { intersectAxisAlignedBoundingBox } from './AxisAlignedBoundingBoxSolver.js';

/**
 * @typedef Mask
 * @property {Object} owner
 * @property {String} name
 * @property {AxisAlignedBoundingBox} box
 * @property {Function} get
 */

function createMask(owner, name, box, get)
{
    return {
        owner,
        name,
        box,
        get,
    };
}

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
     */
    constructor(opts = {})
    {
        /** @type {Map<*, Record<String, Mask>>} */
        this.masks = new Map();
        /** @type {Set<AxisAlignedBoundingBox>} */
        this.boxes = new Set();
        
        // Used to store dynamic mask data and provide constant lookup.
        this.dynamics = new Map();
        // Used for efficiently pruning objects when solving.
        this.quadtree = new QuadTree();
    }

    add(owner, maskName, maskValues = {})
    {
        let mask = createMask(owner, maskName, null, null);

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
            let box = new AxisAlignedBoundingBox(this, mask, x, y, rx, ry);
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
            let box = new AxisAlignedBoundingBox(this, mask, x, y, rx, ry);
            this.boxes.add(box);
            mask.box = box;
            if ('get' in maskValues)
            {
                mask.get = maskValues.get;
                mask.get(box, owner);
                this.dynamics.set(mask, {
                    halfdx: 0,
                    halfdy: 0,
                });
            }
        }
        else if (typeof maskValues === 'function')
        {
            let box = new AxisAlignedBoundingBox(this, mask, 0, 0, 0, 0);
            this.boxes.add(box);
            mask.box = box;
            mask.get = maskValues;
            mask.get(box, owner);
            this.dynamics.set(mask, {
                halfdx: 0,
                halfdy: 0,
            });
        }
        else
        {
            throw new Error('Invalid mask option type.');
        }
    }

    /**
     * @returns {Boolean} Whether the mask for the given name exists and was
     * removed from the owner.
     */
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

    /** @returns {Mask} The owned mask for the given name. */
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

    /** @returns {Number} The number of masks that belong to the owner. */
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
     * Solves the current graph for collisions.
     * 
     * @param {Array<Object>} [targets=undefined] A list of active target to solve
     * for. If undefined or null, it will solve collisions using all boxes as
     * active targets. This can be used to prune box collisions that are not
     * relevant, or "active".
     * @returns {Array<CollisionResult>} The collisions found in the current graph.
     */
    solve(targets = undefined)
    {
        // Update dynamic boxes to include motions
        for(let mask of this.dynamics.keys())
        {
            let { box, owner } = mask; 
            let x0 = box.x;
            let y0 = box.y;
            mask.get(box, owner);
            let dynamics = this.dynamics.get(mask);
            let halfMotionX = (box.x - x0) / 2;
            let halfMotionY = (box.y - y0) / 2;
            dynamics.halfMotionX = halfMotionX;
            dynamics.halfMotionY = halfMotionY;
            box.x -= halfMotionX;
            box.y -= halfMotionY;
            box.rx += Math.abs(halfMotionX);
            box.ry += Math.abs(halfMotionY);
        }
        
        if (typeof targets === 'undefined' || targets === null)
        {
            targets = this.masks.keys();
        }

        let result = [];
        let quadtree = this.quadtree;
        quadtree.clear();
        quadtree.insertAll(this.boxes);

        // Revert dynamic boxes back to their original dimensions
        for(let mask of this.dynamics.keys())
        {
            const { box } = mask;
            const { halfMotionX, halfMotionY } = this.dynamics.get(mask);
            box.x += halfMotionX;
            box.y += halfMotionY;
            box.rx -= Math.abs(halfMotionX);
            box.ry -= Math.abs(halfMotionY);
        }

        let others = [];
        for(let owner of targets)
        {
            let ownedMasks = Object.values(this.masks.get(owner));
            for(let mask of ownedMasks)
            {
                const { box } = mask;
                quadtree.retrieve(box, others);
                let dx = 0;
                let dy = 0;
                if (this.dynamics.has(mask))
                {
                    const { halfMotionX, halfMotionY } = this.dynamics.get(mask);
                    dx = halfMotionX * 2;
                    dy = halfMotionY * 2;
                }
                for(let other of others)
                {
                    let hit = intersectAxisAlignedBoundingBox(box, other);
                    if (hit)
                    {
                        result.push({
                            owner,
                            other: other.mask.owner,
                            ownerMask: mask,
                            otherMask: other.mask,
                            hit,
                            dx,
                            dy,
                        });
                    }
                }
                others.length = 0;
            }
        }
        return result;
    }
}

/**
 * A representative bounding box to keep positional and
 * dimensional metadata for any object in the
 * {@link AxisAlignedBoundingBoxGraph}.
 */
export class AxisAlignedBoundingBox
{
    constructor(aabbGraph, mask, x, y, rx, ry)
    {
        this.aabbGraph = aabbGraph;
        this.mask = mask;
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
        return this.setHalfSize(width / 2, height / 2);
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
