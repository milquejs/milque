import { GameObject, Sprite } from './Room.js';

import { Bullet, BULLET_SPEED } from './Bullet.js';
import { MoveDown, MoveLeft, MoveRight, MoveUp, Shoot } from './PlayerInputs.js';

export const PLAYER_SPEED = 1;
export const PLAYER_SHOOT_COOLDOWN = 10;

export class Player extends GameObject
{
    constructor()
    {
        super();

        this.name = 'player';
        this.sprite = new Sprite('image:toast.png');

        this.facing = 1;
        this.shootCooldown = 0;
    }

    /** @override */
    onUpdate(dt)
    {
        const dx = MoveRight.value - MoveLeft.value;
        const dy = MoveDown.value - MoveUp.value;

        this.x += PLAYER_SPEED * dx * dt;
        this.y += PLAYER_SPEED * dy * dt;
        if (this.shootCooldown > 0)
        {
            this.shootCooldown -= dt;
        }

        if (Shoot.value)
        {
            if (this.shootCooldown <= 0)
            {
                this.shootCooldown = PLAYER_SHOOT_COOLDOWN;
                let bullet = this.room.createInstance(this.x, this.y, Bullet);
                bullet.dx = BULLET_SPEED * this.facing;
            }
        }
        else
        {
            if (dx !== 0)
            {
                this.facing = Math.sign(dx);
            }
        }
    }

    /** @override */
    onRender(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 16, 16);
        super.onRender(ctx);
    }
}
