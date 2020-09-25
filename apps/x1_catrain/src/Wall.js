import { GameObject } from './entity/GameObject.js';
import { CollisionMask } from './systems/CollisionMask.js';
import { Transform } from './systems/Transform.js';

export function createWall(entityManager, left, top, right, bottom)
{
    const rx = (right - left) / 2;
    const ry = (bottom - top) / 2;
    const x = left + rx;
    const y = top + ry;

    let gameObject = new GameObject(entityManager);
    
    let transform = gameObject.add(Transform);
    transform.x = x;
    transform.y = y;

    let collisionMask = gameObject.add(CollisionMask);
    collisionMask.solid = true;
    collisionMask.shapeType = 'aabb';
    collisionMask.shape = {
        x, y,
        rx, ry,
    };

    return gameObject;
}
