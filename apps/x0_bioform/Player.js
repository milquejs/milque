import { GameObject, Sprite } from './Room.js';
import { createInputMap } from './InputMap.js';

import { Bullet, BULLET_SPEED } from './Bullet.js';

export const PLAYER_SPEED = 1;
export const PLAYER_SHOOT_COOLDOWN = 10;
export const PLAYER_INPUT_MAP = createInputMap([
    'moveUp',
    'moveDown',
    'moveRight',
    'moveLeft',
    'shoot'
]);

export class Player extends GameObject
{
    constructor()
    {
        super();

        this.name = 'player';
        this.sprite = new Sprite('sprite/smile.png');

        this.facing = 1;
        this.shootCooldown = 0;
    }

    /** @override */
    onUpdate(dt)
    {
        const dx = PLAYER_INPUT_MAP.moveRight.value - PLAYER_INPUT_MAP.moveLeft.value;
        const dy = PLAYER_INPUT_MAP.moveDown.value - PLAYER_INPUT_MAP.moveUp.value;

        this.x += PLAYER_SPEED * dx * dt;
        this.y += PLAYER_SPEED * dy * dt;
        if (this.shootCooldown > 0)
        {
            this.shootCooldown -= dt;
        }

        if (PLAYER_INPUT_MAP.shoot.value)
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
