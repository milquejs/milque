import { IntersectionWorld } from './lib.js';
import { BoxRenderer } from './lib.js';
import { createLevel, level1 } from './levels.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const level = createLevel(level1);
    const player = Player(input, level1.start.x, level1.start.y);
    const finish = Finish(level1.exit.x, level1.exit.y);
    
    const physics = IntersectionWorld.createIntersectionWorld();
    physics.dynamics.push(player.masks.aabb);
    physics.masks.push(...[
        player.masks.ground,
        player.masks.motion,
        player.masks.aabbHit,
    ]);
    physics.statics.push(...level.statics, finish.masks.aabb);

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 60;
        
        player.update(dt);

        ctx.clearRect(0, 0, display.width, display.height);

        ctx.setTransform(1, 0, 0, -1, 0, 0);
        ctx.translate(0, -display.height);

        BoxRenderer.draw(ctx, [player, finish]);

        physics.update(dt);
        physics.render(ctx);
    });
}

function Finish(x, y)
{
    let finish = {
        x, y,
        [BoxRenderer.Info]: {
            width: 16,
            height: 16,
            color: 'red',
        },
        masks: {
            aabb: {
                get x() { return finish.x; },
                get y() { return finish.y; },
                set x(x) { finish.x = x; },
                set y(y) { finish.y = y; },
                rx: 8,
                ry: 8,

                hit: null,
            },
        }
    };
    return finish;
}

function Player(input, x = 0, y = 0)
{
    const playerControls = {
        get up() { return input.getInput('up').value; },
        get down() { return input.getInput('down').value; },
        get left() { return input.getInput('left').value; },
        get right() { return input.getInput('right').value; },
    };
    let player = {
        x,
        y,
        dx: 0,
        dy: 0,
        motionX: 0,
        motionY: 0,
        jumping: false,
        [BoxRenderer.Info]: {
            get width() { return player.masks.aabb.rx * 2; },
            get height() { return player.masks.aabb.ry * 2; },
        },
        masks: {
            aabb: {
                get x() { return player.x; },
                get y() { return player.y; },
                set x(x) { player.x = x; },
                set y(y) { player.y = y; },
                rx: 8,
                ry: 8,

                get dx() { return player.dx; },
                get dy() { return player.dy; },
                set dx(dx) { player.dx = dx; },
                set dy(dy) { player.dy = dy; },
                hit: null,
            },
            motion: {
                type: 'segment',
                get x() { return player.masks.aabb.x; },
                get y() { return player.masks.aabb.y; },
                get dx() { return player.motionX; },
                get dy() { return player.motionY; },
                px: 0,
                py: 0,
                
                hit: null,
            },
            ground: {
                type: 'segment',
                get x() { return player.masks.aabb.x - player.masks.aabb.rx; },
                get y() { return player.masks.aabb.y - player.masks.aabb.ry - 0.1; },
                get dx() { return player.masks.aabb.rx * 2; },
                get dy() { return 0; },
                px: 0,
                py: 0,
                
                hit: null,
            },
            aabbHit: {
                type: 'point',
                get x() { return player.masks.aabb.hit ? player.masks.aabb.hit.x : player.masks.aabb.x; },
                get y() { return player.masks.aabb.hit ? player.masks.aabb.hit.y : player.masks.aabb.y; },
                
                hit: null,
            },
        },
        update(dt)
        {
            const maxMoveSpeed = 8;
            const moveSpeed = 0.6;
            const moveFriction = 0.85;
            const jumpSpeed = 12;
            const jumpMoveFriction = 0.9;
            const gravitySpeed = 0.8;
            const wallSlideFriction = 0.3;

            const hit = this.masks.aabb.hit;
            const hitGround = hit && hit.ny > 0;

            if (hitGround && this.motionY < 0) {
                this.motionY = 0;
            } else {
                this.motionY -= gravitySpeed;
            }

            // Wall slide / bounce
            if (hit && (hit.nx < 0 && playerControls.right || hit.nx > 0 && playerControls.left)) {

                if (playerControls.up) {
                    this.motionX = hit.nx * jumpSpeed;
                    this.motionY = jumpSpeed;
                } else {
                    this.motionY *= wallSlideFriction;
                }
            }

            if (hitGround && playerControls.up) {
                this.motionY = jumpSpeed;
            }

            if (playerControls.down) {
                if (this.masks.aabb.ry > 4) {
                    this.masks.aabb.ry = 4;
                    this.y -= 4;
                }
            } else {
                if (this.masks.aabb.ry < 8) {
                    this.masks.aabb.ry = 8;
                    this.y += 4;
                }
            }

            if (playerControls.left) {
                this.motionX -= moveSpeed;
            }
            if (playerControls.right) {
                this.motionX += moveSpeed;
            }
            
            this.motionX *= hitGround ? moveFriction : jumpMoveFriction;
            if (Math.abs(this.motionX) > maxMoveSpeed) this.motionX = maxMoveSpeed * Math.sign(this.motionX);

            if (hit && Math.abs(hit.nx) > 0 && Math.sign(hit.nx) !== Math.sign(this.motionX)) {
                this.motionX = 0;
            }

            if (hit && Math.abs(hit.ny) > 0 && Math.sign(hit.ny) !== Math.sign(this.motionY)) {
                this.motionY = hit.ny < 0 ? -gravitySpeed : 0;
            }

            this.dx += this.motionX;
            this.dy += this.motionY;

            // Never fall off
            if (this.y <= 0) this.y = 0;
        }
    };
    return player;
}
