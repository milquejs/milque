import { KeyMapBuilder, createKeyState } from './InputHelper.js';
import * as Intersection from './IntersectionHelper.js';
import { createIntersectionWorld } from './IntersectionWorld.js';

function main()
{
    const display = document.querySelector('display-port');
    
    // This is what the user sees and can edit.
    const keyMap = KeyMapBuilder()
        .set('up', 'ArrowUp')
        .set('down', 'ArrowDown')
        .set('left', 'ArrowLeft')
        .set('right', 'ArrowRight')
        .build();
    const keyState = createKeyState(display, keyMap);

    // input.getContextualInputState('playerControls');
    // Easy to access, fast, and serializable
    const playerControls = {
        get down() { return keyState.state.down.value; },
        get up() { return keyState.state.up.value; },
        get left() { return keyState.state.left.value; },
        get right() { return keyState.state.right.value; },
    };

    const world = {
        entities: [],
        update(dt)
        {
            for(let entity of this.entities)
            {
                entity.update(dt);
            }
        },
        render(ctx)
        {
            for(let entity of this.entities)
            {
                entity.render(ctx);
            }
        },
        poll()
        {
            keyState.poll();
        }
    };

    display.addEventListener('frame', e => {
        const ctx = e.detail.context;
        const dt = e.detail.deltaTime / 60;

        if (world.poll) world.poll();
        if (world.update) world.update(dt);

        // Transform canvas to first quadrant; (0,0) = bottom left, (width, height) = top right.
        ctx.setTransform(1, 0, 0, -1, 0, 0);
        ctx.translate(0, -display.height);

        // Paint it black.
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.width, display.height);

        if (world.render) world.render(ctx);

        if (world.physics)
        {
            world.physics.update(dt);
            world.physics.render(ctx);
        }
    });

    main();

    function main()
    {
        let player = Player();
        world.entities = [
            player
        ];

        let physics = createIntersectionWorld();
        physics.dynamics.push(player.masks.aabb);
        physics.masks.push(...[
            player.masks.ground,
            player.masks.motion,
            player.masks.aabbHit,
        ]);
        physics.statics.push(...[
            Intersection.createRect(50, 0, 150, 16),
            Intersection.createRect(20, 30, 30, 110),
            Intersection.createRect(0, 0, 10, display.height),
            Intersection.createRect(0, 0, display.width, 10),
            Intersection.createRect(display.width - 10, 0, display.width, display.height),
            Intersection.createRect(0, display.height - 10, display.width, display.height),
        ]);
        world.physics = physics;
    }

    function Player()
    {
        let player = {
            x: 100,
            y: 100,
            dx: 0,
            dy: 0,
            motionX: 0,
            motionY: 0,
            jumping: false,
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
            },
            render(ctx)
            {
                ctx.fillStyle = 'white';
                ctx.fillRect(this.x - this.masks.aabb.rx, this.y - this.masks.aabb.ry, this.masks.aabb.rx * 2, this.masks.aabb.ry * 2);
            }
        };
        return player;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    main();
});
