const TOPLEFT = 0;
const TOPRIGHT = 1;
const BOTTOMLEFT = 2;
const BOTTOMRIGHT = 3;

export function createBoundingBox(x, y, width, height = width)
{
    return { x, y, width, height };
}

export function overlap(box, other)
{
    return box.x >= other.x &&
        box.x + box.width <= other.x + other.width &&
        box.y >= other.y &&
        box.y + box.height <= other.y + other.height;
}

function evaluateNodeIndex(node, box)
{
    const boundingBox = node.boundingBox;
    const left = box.x <= boundingBox.x + boundingBox.width / 2;
    const top = box.y <= boundingBox.y + boundingBox.height / 2;
    // This maps to the directions for top/bottom and left/right indices.
    return (top ? 0 : 2) + (left ? 1 : 0);
}

class QuadNode
{
    constructor(boundingBox, depth = 0, maxDepth = 4, maxChildren = 4)
    {
        this.boundingBox = boundingBox;

        this.children = [];
        this.nodes = [];

        this.depth = depth;
        this.maxDepth = maxDepth;
        this.maxChildren = maxChildren;
    }

    add(box)
    {
        if (this.nodes.length > 0)
        {
            this.nodes[evaluateNodeIndex(this, box)].add(box);
        }
        else
        {
            this.children.push(box);

            if (this.depth < this.maxDepth && this.children.length > this.maxChildren)
            {
                this.subdivide();

                for(const child of this.children)
                {
                    // Although this looks like a recursive call, it will
                    // always go into the other case.
                    this.add(child);
                }

                this.children.length = 0;
            }
        }
    }

    get(box, dst = [])
    {
        if (this.nodes.length > 0)
        {
            return this.nodes[evaluateNodeIndex(this, box)].get(box, dst);
        }

        dst.push(...this.children);
        return dst;
    }

    clear()
    {
        this.children.length = 0;

        for(const node of this.nodes)
        {
            node.clear();
        }

        this.nodes.length = 0;
    }

    subdivide()
    {
        const depth = this.depth + 1;

        const boundingX = this.boundingBox.x;
        const boundingY = this.boundingBox.y;

        const boundingHalfWidth = this.boundingBox.width / 2;
        const boundingHalfHeight = this.boundingBox.height / 2;
        const boundingOffsetX = boundingX + boundingHalfWidth;
        const boundingOffsetY = boundingY + boundingHalfHeight;

        this.nodes.length = 0;
        // TOPLEFT
        this.nodes.push(new QuadNode(createBoundingBox(boundingX, boundingY, boundingHalfWidth, boundingHalfHeight), depth, this.maxDepth, this.maxChildren));
        // TOPRIGHT
        this.nodes.push(new QuadNode(createBoundingBox(boundingOffsetX, boundingY, boundingHalfWidth, boundingHalfHeight), depth, this.maxDepth, this.maxChildren));
        // BOTTOMLEFT
        this.nodes.push(new QuadNode(createBoundingBox(boundingX, boundingOffsetY, boundingHalfWidth, boundingHalfHeight), depth, this.maxDepth, this.maxChildren));
        // BOTTOMRIGHT
        this.nodes.push(new QuadNode(createBoundingBox(boundingOffsetX, boundingOffsetY, boundingHalfWidth, boundingHalfHeight), depth, this.maxDepth, this.maxChildren));
    }
}

class QuadBoxNode extends QuadNode
{
    constructor(boundingBox, depth = 0, maxDepth = 4, maxChildren = 4)
    {
        super(boundingBox, depth, maxDepth, maxChildren);

        this._stuckChildren = [];
    }

    /** @override */
    add(box)
    {
        if (this.nodes.length > 0)
        {
            const index = evaluateNodeIndex(this, box);
            const node = this.nodes[index];

            const boundingBox = node.boundingBox;
            if (overlap(box, boundingBox))
            {
                this.nodes[index].add(box);
            }
            else
            {
                this._stuckChildren.push(box);
            }
        }
        else
        {
            this.children.push(box);

            if (this.depth < this.maxDepth && this.children.length > this.maxChildren)
            {
                this.subdivide();

                for(const child of this.children)
                {
                    // Although this looks like a recursive call, it will
                    // always go into the other case.
                    this.add(child);
                }

                this.children.length = 0;
            }
        }
    }

    /** @override */
    get(box, dst = [])
    {
        if (this.nodes.length > 0)
        {
            const node = this.nodes[evaluateNodeIndex(this, box)];

            if (overlap(box, this.boundingBox))
            {
                node.get(box, dst);
            }
            else
            {
                if (box.x <= this.nodes[TOPRIGHT].boundingBox.x)
                {
                    if (box.y <= this.nodes[BOTTOMLEFT].boundingBox.y)
                    {
                        this.nodes[TOPLEFT].values(dst);
                    }

                    if (box.y + box.height > this.nodes[BOTTOMLEFT].boundingBox.y)
                    {
                        this.nodes[BOTTOMLEFT].values(dst);
                    }
                }

                if (box.x + box.width > this.nodes[TOPRIGHT].boundingBox.x)
                {
                    if (box.y <= this.nodes[BOTTOMRIGHT].boundingBox.y)
                    {
                        this.nodes[TOPRIGHT].values(dst);
                    }

                    if (box.y + box.height > this.nodes[BOTTOMRIGHT].boundingBox.y)
                    {
                        this.nodes[BOTTOMRIGHT].values(dst);
                    }
                }
            }
        }

        dst.push(...this._stuckChildren);
        dst.push(...this.children);
    }

    values(dst = [])
    {
        if (this.nodes.length > 0)
        {
            for(const node of this.nodes)
            {
                node.getAll(dst);
            }
        }
        dst.push(this._stuckChildren);
        dst.push(this.children);
        return dst;
    }
}

class QuadTree
{
    constructor(x, y, width, height = width)
    {
        this.root = new QuadBoxNode(x, y, width, height);
    }

    clear()
    {
        this.root.clear();
    }

    add(box, ...boxes)
    {
        this.root.add(box);

        if (boxes.length > 0)
        {
            for(const i of boxes)
            {
                this.root.add(i);
            }
        }
    }

    get(box, dst = [])
    {
        return this.root.get(box, dst);
    }
}

export default QuadTree;
