class CollisionManager
{
    constructor()
    {
        this._solvers = new Map();
        this._bodies = new Set();
    }

    registerCollisionSolver(typeA, typeB, solver)
    {
        this._solvers.set(typeA + '-' + typeB, solver);

        if (typeA !== typeB)
        {
            this._solvers.set(typeB + '-' + typeA, (ctx, a, b) => solver(ctx, b, a));
        }

        return this;
    }

    getCollisionSolver(typeA, typeB)
    {
        return this._solvers.get(typeA + '-' + typeB);
    }

    createBody(position, scale = 1, padding = 0)
    {
        const body = {
            position,
            shape: null,
            scale,
            padding,
            attachShape(shape)
            {
                this.shape = shape;
                return this;
            }
        };
        this._bodies.add(body);
        return body;
    }

    destroyBody(body)
    {
        this._bodies.delete(body);
    }

    createCircle(position, radius = 1, scale = 1, padding = 0)
    {
        const body = this.createBody(position, scale, padding);
        const shape = {
            type: 'circle',
            radius
        };
        return body.attachShape(body, shape);
    }

    createAABB(position, width, height, angle = 0, scale = 1, padding = 0)
    {
        const body = this.createBody(position, scale, padding);
        const shape = {
            type: 'aabb',
            width,
            height,
            angle
        };
        return body.attachShape(body, shape);
    }

    createPoint(position, padding)
    {
        const body = this.createBody(position, 1, padding);
        const shape = {
            type: 'point'
        };
        return body.attachShape(body, shape);
    }

    getPotentials(body)
    {

    }

    getCollisions(body)
    {
        
    }
}

function aabbAABB(ctx, a, b)
{
}

function circleCircle(ctx, a, b)
{

}

function circleAABB(ctx, a, b)
{
    
}

function polygonPolygon(ctx, a, b)
{
    
}

function polygonCircle(ctx, a, b)
{

}

function polygonAABB(ctx, a, b)
{

}

function pointCircle(ctx, a, b)
{

}

function pointAABB(ctx, a, b)
{

}

function pointPolygon(ctx, a, b)
{

}
