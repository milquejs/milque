import { Utils, EntityQuery, Random } from './milque.js';
import { Camera2D } from './Camera2D.js';
import * as MoveControls from './MoveControls.js';
import * as CameraHelper from './CameraHelper.js';
import * as MouseControls from './MouseControls.js';

const TIME_STEP = 100;
const CAMERA_SPEED = 0.05;

const PLAYER_ROTATION_DELTA = 0.1;

const PLAYER_CONTROL_ACCELERATION = 0.02;
const PLAYER_CONTROL_BIAS_FRICTION = 0.01;
const PLAYER_CONTROL_MIN_SPEED = 1;
const PLAYER_CONTROL_FRICTION = 0.005;
const INV_PLAYER_CONTROL_FRICTION = 1 - PLAYER_CONTROL_FRICTION;

export function onStart(game)
{
    this.game = game;
    this.player = {
        x: 300, y: 300,
        rotation: 0,
        radius: 16,

        dx: 0,
        dy: 0,

        orbitTarget: null,
        orbitting: false,
        moving: false,
        heading: 0,
        speed: 0,
        acceleration: PLAYER_CONTROL_ACCELERATION,
    };

    this.sun = {
        x: 0, y: 0,
        radius: 200,
    };

    this.planet = {
        x: 2000, y: 100,
        radius: 80,
    };

    this.gravityWells = [];
    this.bullets = [];

    this.zoom = 1;
    this.camera = new Camera2D();

    createGravityWell(this, this.sun.x, this.sun.y, 1000);
    createGravityWell(this, this.planet.x, this.planet.y, 400);
}

export function onUpdate(dt)
{
    dt *= TIME_STEP;

    updatePlayerControls(this.game, this.player, dt);

    if (MouseControls.LEFT_DOWN.value)
    {
        this.zoom *= 1.01;
        // createBullet(this, this.player.x, this.player.y, this.player.heading, BULLET_SPEED + this.player.speed);
    }
    else if (MouseControls.RIGHT_DOWN.value)
    {
        this.zoom *= 0.99;
    }
    
    this.camera.transform.setScale(this.zoom);

    createExhaustParticles(this.game, this.player.x, this.player.y, this.player.rotation - Math.PI);

    this.player.dx *= 0.8;
    this.player.dy *= 0.8;

    this.player.rotation = Utils.lookAt2D(this.player.rotation, this.player.heading, dt * PLAYER_ROTATION_DELTA);
    this.player.x += Math.cos(this.player.heading) * this.player.speed + this.player.dx;
    this.player.y += Math.sin(this.player.heading) * this.player.speed + this.player.dy;

    Camera2D.followTarget(this.camera, this.player, dt * CAMERA_SPEED);

    updateExhaustParticles(dt, this.game);
    updateGravityWells(dt, this, this.gravityWells);
    updateBullets(dt, this);
}

export function onRender(ctx, view, world)
{
    CameraHelper.drawWorldGrid(ctx, view, world.camera);

    Camera2D.applyTransform(ctx, world.camera, view.width / 2, view.height / 2);
    {
        renderGravityWells(ctx, world.gravityWells);
        if (world.player.orbitting)
        {
            ctx.beginPath();
            ctx.moveTo(world.player.x, world.player.y);
            ctx.lineTo(world.player.orbitTarget.x, world.player.orbitTarget.y);
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#00FF00';
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        Utils.drawCircle(ctx, world.sun.x, world.sun.y, world.sun.radius, '#FFFC60', false);
        Utils.drawCircle(ctx, world.planet.x, world.planet.y, world.planet.radius, '#0000FF', false);

        drawExhaustParticles(ctx, world.game);
        Utils.drawBox(ctx, world.player.x, world.player.y, world.player.rotation, world.player.radius * 2, world.player.radius * 2, '#AAAAAA', false);

        renderBullets(ctx, world);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    CameraHelper.drawWorldTransformGizmo(ctx, view, world.camera);
}

/**********************************************************/
/* Bullets */
/**********************************************************/

class Bullet
{
    constructor()
    {
        this.source = null;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.energy = 0;
    }
}

const BULLET_SPEED = 1;
const BULLET_ENERGY = 100;
const BULLET_WIDTH = 8;
const BULLET_HEIGHT = 4;
const BULLETS = new EntityQuery([Bullet]);

function createBullet(world, x, y, heading, speed = BULLET_SPEED)
{
    let entityId = world.game.entities.createEntity();
    return world.game.entities.addComponent(entityId, Bullet, {
        x, y,
        dx: Math.cos(heading) * speed,
        dy: Math.sin(heading) * speed,
        rotation: heading,
        energy: BULLET_ENERGY,
    });
}

function renderBullets(ctx, world)
{
    for(let bullet of BULLETS.selectComponent(world.game.entities))
    {
        Utils.drawBox(ctx, bullet.x, bullet.y, bullet.rotation, BULLET_WIDTH, BULLET_HEIGHT, '#FFFF00', false);
    }
}

function updateBullets(dt, world)
{
    for(let entityId of BULLETS.select(world.game.entities))
    {
        let bullet = world.game.entities.getComponent(entityId, Bullet);
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        bullet.energy -= dt;
        if (bullet.energy < 0)
        {
            world.game.entities.destroyEntity(entityId);
        }
    }
}

/**********************************************************/
/* GravityWells */
/**********************************************************/

// The percent of the radius that is the inner well
const GRAVITY_WELL_ORBIT_RADIUS_RATIO = 0.6;
// How much force to apply to target within inner well
const GRAVITY_WELL_ORBIT_FORCE = 0.005;
// The range to orbit around within the radius + padding
const GRAVITY_WELL_ORBIT_PADDING = 4;
// How much force to apply to target turning in place while getting into orbit
const GRAVITY_WELL_ORBIT_DAMPING_FORCE = GRAVITY_WELL_ORBIT_FORCE * 20;
// How much force to apply to target rotation within the gravity well
const GRAVITY_WELL_ORBIT_ROTATION_DELTA = 0.05;
// How much force to apply as gravity outside of inner well
const GRAVITY_WELL_PULL_MAGNITUDE = 2;
// Maximum pull gravity can apply (even when really close)
const MAX_GRAVITY_WELL_PULL_FACTOR = 0.8;

function createGravityWell(world, x, y, radius, orbitable = true)
{
    let result = { x, y, radius, orbitable };
    world.gravityWells.push(result);
    return result;
}

function renderGravityWells(ctx, gravityWells)
{
    for(let gravityWell of gravityWells)
    {
        if (gravityWell.orbitable)
        {
            let orbitDistance = gravityWell.radius * GRAVITY_WELL_ORBIT_RADIUS_RATIO;
            Utils.drawCircle(ctx, gravityWell.x, gravityWell.y, orbitDistance, '#00FF00', true);
        }
        Utils.drawCircle(ctx, gravityWell.x, gravityWell.y, gravityWell.radius, '#FFFF00', true);
    }
}

function updateGravityWells(dt, world, gravityWells)
{
    let player = world.player;
    player.orbitting = false;

    for(let gravityWell of gravityWells)
    {
        let isDoingOrbit = false;

        let distance = Utils.distance2D(player, gravityWell);
        if (gravityWell.orbitable)
        {
            let orbitDistance = gravityWell.radius * GRAVITY_WELL_ORBIT_RADIUS_RATIO;
            
            if (distance < orbitDistance + GRAVITY_WELL_ORBIT_PADDING)
            {
                let direction = Utils.direction2D(gravityWell, player);

                let targetHeading = direction;
                let orbitDistanceRatio = (distance - orbitDistance) / GRAVITY_WELL_ORBIT_PADDING;

                if (orbitDistanceRatio < -1)
                {
                    targetHeading = direction;
                }
                else if (orbitDistanceRatio < 1)
                {
                    targetHeading = direction - Math.PI / 2;
                    player.orbitting = true;
                    player.orbitTarget = gravityWell;
                }
                else
                {
                    targetHeading = direction - Math.PI;
                }
                targetHeading = direction - Utils.clampRange((orbitDistanceRatio + 1) * Math.PI, 0, Math.PI);

                isDoingOrbit = orbitDistanceRatio < -1 || !player.moving;
                if (isDoingOrbit)
                {
                    player.heading = Utils.lookAt2D(player.heading, targetHeading, dt * GRAVITY_WELL_ORBIT_ROTATION_DELTA);
                    if (player.orbitting && Utils.lookAt2D(player.heading, targetHeading, 1) !== player.heading)
                    {
                        player.speed = Utils.lerp(player.speed, 0, dt * GRAVITY_WELL_ORBIT_DAMPING_FORCE);
                    }
                    else
                    {
                        player.speed = Utils.lerp(player.speed, PLAYER_CONTROL_MIN_SPEED, dt * GRAVITY_WELL_ORBIT_FORCE);
                    }
                }
            }
        }

        if (!isDoingOrbit)
        {
            applyGravity(gravityWell, player, gravityWell.radius);
        }
        else
        {
            // Only do the orbit of 1 gravity well
            break;
        }
    }

    if (!player.orbitting)
    {
        player.orbitTarget = null;
    }
}

function applyGravity(source, target, radius)
{
    let distance = Utils.distance2D(target, source);
    if (distance < radius)
    {
        let towards = Utils.direction2D(target, source);
        let ratio = Math.min(MAX_GRAVITY_WELL_PULL_FACTOR, 1 - (distance / (radius * GRAVITY_WELL_PULL_MAGNITUDE)));
        target.dx += Math.cos(towards) * ratio * ratio;
        target.dy += Math.sin(towards) * ratio * ratio;
    }
}

/**********************************************************/
/* ExhaustParticles */
/**********************************************************/

class ExhaustParticle
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.age = 0;
        this.color = '#FFFFFF';

        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
    }
}

const EXHAUST_PARTICLES = new EntityQuery([ExhaustParticle]);
const EXHAUST_PARTICLE_SIZE = 10;
const EXHAUST_PARTICLE_MAX_AGE = 40;
const EXHAUST_PARTICLE_SPEED = 2;

function createExhaustParticles(game, x, y, rotation, speed = EXHAUST_PARTICLE_SPEED, radius = 8, amount = 1)
{
    for(let i = amount; i >= 0; --i)
    {
        let entityId = game.entities.createEntity();
        game.entities.addComponent(entityId, ExhaustParticle, {
            x: x + Random.randomRange(-radius, radius), y: y + Random.randomRange(-radius, radius),
            dx: Math.cos(rotation) * speed,
            dy: Math.sin(rotation) * speed,
            rotation,
        });
    }
}

function updateExhaustParticles(dt, game)
{
    for(let entityId of EXHAUST_PARTICLES.select(game.entities))
    {
        let component = game.entities.getComponent(entityId, ExhaustParticle);
        component.age += dt;
        component.x += component.dx * dt;
        component.y += component.dy * dt;

        if (component.age >= EXHAUST_PARTICLE_MAX_AGE)
        {
            game.entities.destroyEntity(entityId);
        }
    }
}

function drawExhaustParticles(ctx, game)
{
    for(let component of EXHAUST_PARTICLES.selectComponent(game.entities))
    {
        let ageRatio = 1 - (component.age / EXHAUST_PARTICLE_MAX_AGE);
        Utils.drawBox(ctx,
            component.x, component.y,
            component.rotation,
            ageRatio * EXHAUST_PARTICLE_SIZE,
            ageRatio * EXHAUST_PARTICLE_SIZE,
            component.color,
            false
        );
    }
}

/**********************************************************/
/* Utility */
/**********************************************************/

function updatePlayerControls(game, player, dt)
{
    const xControl = MoveControls.RIGHT.value - MoveControls.LEFT.value;
    const yControl = MoveControls.DOWN.value - MoveControls.UP.value;
    const isMoveControlled = xControl || yControl;

    let dx = Math.cos(player.heading) * player.speed;
    let dy = Math.sin(player.heading) * player.speed;

    if (isMoveControlled)
    {
        const headingControl = Math.atan2(yControl, xControl);

        if (xControl)
        {
            dx += Math.cos(headingControl) * player.acceleration;
        }
        else
        {
            dx = Utils.lerp(dx, 0, dt * PLAYER_CONTROL_BIAS_FRICTION);
        }

        if (yControl)
        {
            dy += Math.sin(headingControl) * player.acceleration;
        }
        else
        {
            dy = Utils.lerp(dy, 0, dt * PLAYER_CONTROL_BIAS_FRICTION);
        }
    }

    player.moving = isMoveControlled;
    player.heading = Math.atan2(dy, dx);
    player.speed = Math.sqrt(dx * dx + dy * dy);

    if (!isMoveControlled)
    {
        if (player.speed < PLAYER_CONTROL_MIN_SPEED)
        {
            player.speed += PLAYER_CONTROL_ACCELERATION;
        }
    }
    else
    {
        player.speed *= INV_PLAYER_CONTROL_FRICTION;
    }
}