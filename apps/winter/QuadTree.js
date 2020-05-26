// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

export function createBounds(x, y, rx, ry)
{
    return { x, y, rx, ry };
}

const MAX_OBJECTS = 10;
const MAX_LEVELS = 5;

export class QuadTree
{
    constructor(level = 0, bounds = createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
    {
        this.level = level;
        this.bounds = bounds;

        this.objects = [];
        this.nodes = new Array(4);
    }

    clear()
    {
        this.objects.length = 0;

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

    findQuadIndex(object)
    {
        let { x, y, rx, ry } = this.bounds;

        let index = -1;
        let midpointX = x + rx;
        let midpointY = y + ry;

        let isTop = object.y < midpointY && object.y + object.ry * 2 < midpointY;
        let isBottom = object.y > midpointY;

        let isLeft = object.x < midpointX && object.x + object.rx * 2 < midpointX;
        let isRight= object.x > midpointX;

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

    insertAll(objects)
    {
        for(let object of objects)
        {
            this.insert(object);
        }
    }

    insert(object)
    {
        let hasNode = this.nodes[0];

        if (hasNode)
        {
            let quadIndex = this.findQuadIndex(object);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].insert(object);
                return;
            }
        }

        this.objects.push(object);

        if (this.objects.length > MAX_OBJECTS && this.level < MAX_LEVELS)
        {
            if (!hasNode) this.split();

            for(let i = this.objects.length - 1; i >= 0; --i)
            {
                let obj = this.objects[i];
                let quadIndex = this.findQuadIndex(obj);
                if (quadIndex >= 0)
                {
                    this.objects.splice(i, 1);
                    this.nodes[quadIndex].insert(obj);
                }
            }
        }
    }

    retreive(out, object)
    {
        if (this.nodes[0])
        {
            let quadIndex = this.findQuadIndex(object);
            if (quadIndex >= 0)
            {
                this.nodes[quadIndex].retreive(out, object);
            }
        }

        out.push(...this.objects);
        return out;
    }
}
