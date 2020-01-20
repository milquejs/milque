import { Utils, ViewHelper } from './milque.js';
import { Camera2D } from './Camera2D.js';
import * as MoveControls from './MoveControls.js';
import * as CameraHelper from './CameraHelper.js';

const TIME_STEP = 100;
const CAMERA_SPEED = 0.05;

const PLAYER_ROTATION_DELTA = 0.1;

const PLAYER_CONTROL_ACCELERATION = 0.02;
const PLAYER_CONTROL_BIAS_FRICTION = 0.01;
const PLAYER_CONTROL_MIN_SPEED = 1;
const PLAYER_CONTROL_FRICTION = 0.003;
const INV_PLAYER_CONTROL_FRICTION = 1 - PLAYER_CONTROL_FRICTION;

export function onStart()
{
    this.player = {
        x: 0, y: 0,
        rotation: 0,
        radius: 16,

        dx: 0,
        dy: 0,

        heading: 0,
        speed: 0,
        acceleration: PLAYER_CONTROL_ACCELERATION,
    };

    this.sun = {
        x: 0, y: 0,
        radius: 100,
    };

    this.camera = new Camera2D();
}

export function onUpdate(dt)
{
    dt *= TIME_STEP;

    updatePlayerControls(this.player, dt);
    applyGravity(this.sun, this.player, 200);

    this.player.dx *= 0.8;
    this.player.dy *= 0.8;

    this.player.rotation = Utils.lookAt2D(this.player.rotation, this.player.heading, dt * PLAYER_ROTATION_DELTA);
    this.player.x += Math.cos(this.player.heading) * this.player.speed + this.player.dx;
    this.player.y += Math.sin(this.player.heading) * this.player.speed + this.player.dy;

    Camera2D.followTarget(this.camera, this.player, dt * CAMERA_SPEED);
}

export function onRender(ctx, view, world)
{
    CameraHelper.drawNavigationInfo(ctx, view, world.camera);
    Camera2D.applyTransform(ctx, world.camera, view.width / 2, view.height / 2);
    Utils.drawCircle(ctx, this.sun.x, this.sun.y, this.sun.radius, '#FFFC60', false);
    Utils.drawBox(ctx, this.player.x, this.player.y, this.player.rotation, this.player.radius * 2, this.player.radius * 2, '#AAAAAA', false);
}

function applyGravity(source, target, radius)
{
    const distance = Utils.distance2D(target, source);
    const towards = Utils.direction2D(target, source);
    if (distance < radius)
    {
        target.dx += Math.cos(towards) * 0.1;
        target.dy += Math.sin(towards) * 0.1;
    }
}

function updatePlayerControls(player, dt)
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