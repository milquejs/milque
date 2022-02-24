import { EntityBuilder } from './entity/EntityBuilder.js';
import { CollisionMask } from './systems/CollisionMask.js';
import { Transform } from './systems/Transform.js';

export function createWall(entityManager, left, top, right, bottom)
{
    const rx = (right - left) / 2;
    const ry = (bottom - top) / 2;
    const x = left + rx;
    const y = top + ry;

    const entityId = EntityBuilder.bindEntity(entityManager, entityManager.create());
    {
        let transform = EntityBuilder.addComponent(Transform);
        transform.x = x;
        transform.y = y;
    
        let collisionMask = EntityBuilder.addComponent(CollisionMask);
        collisionMask.solid = true;
        collisionMask.shapeType = 'aabb';
        collisionMask.shape = {
            x, y,
            rx, ry,
        };
    }
    EntityBuilder.bindEntity(null, null);
    
    return entityId;
}
