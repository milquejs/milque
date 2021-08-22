import { EntityBase } from './EntityBase.js';
import { clamp, lookAt2, toDegrees, toRadians } from '@milque/util';

/**
 * @typedef {import('@milque/input').InputContext} InputContext
 */

const MAX_JUMP_TICKS = 6;
const MIN_JUMP_TICKS = 3;
const MAX_JUMP_ANGLE_COYOTE_TICKS = 1;
const JUMP_SCALE = 0.5;

const MAX_PLAYER_MOTION = 2;
const PLAYER_JUMP_SPEED = 2;
const PLAYER_FRICTION = 0.3;
const INV_PLAYER_FRICTION = 1 - PLAYER_FRICTION;

const PLAYER_TURN_DELTA = 0.3;
const PLAYER_BREATHING_INTERVAL = 500;

export class Player extends EntityBase
{
    constructor()
    {
        super();

        this.x = 0;
        this.y = 0;

        this.motionX = 0;
        this.motionY = 0;
        
        this.angle = 0;
        this.lookAngle = 0;

        this.jump = false;
        this.jumping = false;
        this.jumpTicks = 0;
        this.jumpAngle = 0;

        this.fall = false;
        this.falling = false;
    }

    /**
     * @override
     * @param {InputContext} inputs
     * @param {number} dt
     */
    onInputUpdate(inputs, dt)
    {
        let player = this;
        let dx = inputs.getInputValue('MoveRight') - inputs.getInputValue('MoveLeft');
        let dy = inputs.getInputValue('MoveDown') - inputs.getInputValue('MoveUp');
        let jump = inputs.isButtonPressed('Jump');
        let fall = inputs.isButtonReleased('Jump');
        if (dx || dy)
        {
            let rads = Math.atan2(dy, dx);
            player.angle = toDegrees(rads);
        }
        if (jump)
        {
            player.jump = true;
        }
        if (fall)
        {
            player.fall = true;
        }
    }

    /** @override */
    onUpdate()
    {
        let player = this;
        if (player.landing)
        {
            player.landing = false;
        }

        if (player.jumping)
        {
            // Give some leeway to switch jump angle
            if (player.jumpTicks < MAX_JUMP_ANGLE_COYOTE_TICKS)
            {
                player.jumpAngle = player.angle;
            }
            let jumpRads = toRadians(player.jumpAngle);
            player.motionX = Math.cos(jumpRads) * PLAYER_JUMP_SPEED;
            player.motionY = Math.sin(jumpRads) * PLAYER_JUMP_SPEED;
            player.jumpTicks += 1;
            if (player.jumpTicks >= MIN_JUMP_TICKS && (player.fall || player.jumpTicks > MAX_JUMP_TICKS))
            {
                player.falling = true;
                player.jumping = false;
            }
        }
        else if (player.falling)
        {
            let jumpRads = toRadians(player.jumpAngle);
            player.motionX = Math.cos(jumpRads) * PLAYER_JUMP_SPEED;
            player.motionY = Math.sin(jumpRads) * PLAYER_JUMP_SPEED;
            player.jumpTicks -= 1;
            if (player.jumpTicks <= 0)
            {
                player.falling = false;
                player.fall = false;
                // Make sure that we ONLY capture jump after starting a landing
                player.jumping = false;
                player.jump = false;
                player.jumpTicks = 0;
            }
        }
        else
        {
            if (player.jump)
            {
                player.jumping = true;
                player.jumpTicks = 0;
                player.jumpAngle = player.angle;
                // Make sure that we ONLY capture fall after starting a jump
                player.falling = false;
                player.fall = false;
            }
            else
            {
                player.motionX *= INV_PLAYER_FRICTION;
                player.motionY *= INV_PLAYER_FRICTION;

                let signX = Math.sign(player.motionX);
                let signY = Math.sign(player.motionY);
                if (player.motionX * signX > MAX_PLAYER_MOTION)
                {
                    player.motionX = signX * MAX_PLAYER_MOTION;
                }
                if (player.motionY * signY > MAX_PLAYER_MOTION)
                {
                    player.motionY = signY * MAX_PLAYER_MOTION;
                }
            }
        }

        player.x += player.motionX;
        player.y += player.motionY;
    }

    /** @override */
    onRender(ctx)
    {
        const r = ctx.renderer;

        let player = this;
        let lookRads = toRadians(player.lookAngle);
        let targetRads = toRadians(player.angle);
        player.lookAngle = toDegrees(lookAt2(lookRads, targetRads, PLAYER_TURN_DELTA));
        let jumpProgress = (player.jumpTicks / MAX_JUMP_TICKS);
        let jumpHeight = (Math.sin(jumpProgress * Math.PI / 2) - 0.2) * JUMP_SCALE;
        let livingProgress = clamp(Math.cos(performance.now() / PLAYER_BREATHING_INTERVAL), 0, 1) * 0.1;
        let playerScale = 1 + livingProgress;
        if (jumpProgress)
        {
            playerScale += jumpHeight;
        }
        r.draw('slime', 0, player.x, player.y, player.lookAngle + 90, playerScale, playerScale);
    }
}
