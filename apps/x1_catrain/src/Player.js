import { createAxisAlignedBoundingBox } from './aabb/AxisAlignedBoundingBoxIntersectionSolver.js';
import { GameObject } from './entity/GameObject.js';
import { Collidable } from './systems/Collidable.js';
import { CollisionMask } from './systems/CollisionMask.js';
import { Motion } from './systems/Motion.js';
import { Transform } from './systems/Transform.js';

export class Player extends GameObject
{
    constructor(entityManager, input, view)
    {
        super(entityManager);

        this.input = input;
        this.view = view;

        this.add('Player');
        let collisionMask = this.add(CollisionMask);
        collisionMask.shape.rx = 8;
        collisionMask.shape.ry = 8;
        let actionMask = this.add(CollisionMask);
        actionMask.name = 'action';
        actionMask.solid = false;
        actionMask.trigger = true;
        let transform = this.add(Transform);
        transform.y -= 100;
        this.add(Motion);
        this.add(Collidable);
    }

    onUpdate(dt)
    {
        const { input, view } = this;
        
        const moveSpeed = 1;
        let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
        let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');
    
        let motion = this.get(Motion);
        motion.motionX += dx * moveSpeed;
        motion.motionY += dy * moveSpeed;

        let transform = this.get(Transform);
        view.camera.moveTo(transform.x, transform.y, 0, dt);
    }

    onRender(ctx)
    {
        let transform = this.get(Transform);
        ctx.fillStyle = 'red';
        ctx.fillRect(transform.x - 8, transform.y - 8, 16, 16);
    }
}
