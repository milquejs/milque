import { GameObject } from '../GameObject.js';

export class Player extends GameObject
{
    /** @override */
    onUpdate(world, dt)
    {
        let { inputState } = world;
        let moveX = inputState.right - inputState.left;
        let moveY = inputState.down - inputState.up;
        const moveSpeed = 100;

        this.x += moveX * dt * moveSpeed;
        this.y += moveY * dt * moveSpeed;
    }

    /** @override */
    onDraw(world, ctx)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, 16, 16);
    }
}
