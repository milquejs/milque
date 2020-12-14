import { GameObject } from './Room.js';

export const BULLET_SPEED = 4;
export const MAX_BULLET_AGE = 100;

export class Bullet extends GameObject
{
    constructor()
    {
        super();

        this.dx = 0;
        this.dy = 0;
        this.age = 0;
    }

    /** @override */
    onCreate()
    {

    }

    /** @override */
    onUpdate(dt)
    {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
        this.age += dt;
        if (this.age > MAX_BULLET_AGE)
        {
            this.dead = true;
        }
    }

    /** @override */
    onRender(ctx)
    {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 4, 4);
    }
}
