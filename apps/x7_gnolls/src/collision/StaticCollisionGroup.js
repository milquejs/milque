import { CollisionGroup } from './Collision.js';

export class StaticCollisionGroup extends CollisionGroup
{
    static get supportedShapes()
    {
        return [
            'aabb',
            'circle',
        ];
    }

    constructor()
    {
        super();
    }

    /** @override */
    create()
    {

    }
}

class StaticBody
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }
}
