import { GameLoop, Input, Display, Random, Utils } from '../../../core/build/esm/milque.js';

import * as Views from './Views.js';
import * as PlayerControls from './PlayerControls.js';

const PLAYER_MOVE_SPEED = 0.2;
const PLAYER_ROT_SPEED = 0.2;
const MAX_PLAYER_VELOCITY_X = 3;
const MAX_PLAYER_VELOCITY_Y = 3;
const PLAYER_BRAKE_FRICTION = 0.1;
const INV_PLAYER_BRAKE_FRICTION = 1 - PLAYER_BRAKE_FRICTION;

const GRAVITY_MAGNITUDE_FACTOR = 128;

const CART_SPEED = 0.1;
const CART_ROT_SPEED = PLAYER_ROT_SPEED;

const MIN_PLANET_ROT_SPEED = 0.005;
const MAX_PLANET_ROT_SPEED = 0.01;

function start()
{
    this.player = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        rotation: 0,
        brakeMode: false,
    };

    this.carts = [];
    this.planets = [];
    this.gravityWells = [];

    createCartSequence(this, this.player, 4);
    createPlanet(this, 100, 100);
    createGravityWell(this, 100, 100);
}

function update(dt)
{
    Input.poll();
    {
        let xControl = PlayerControls.RIGHT.value - PlayerControls.LEFT.value;
        let yControl = PlayerControls.DOWN.value - PlayerControls.UP.value;
        let brakeControl = PlayerControls.BRAKE.value;
        let toggleBrakeControl = PlayerControls.TOGGLE_BRAKE.value;
        
        this.player.dx += xControl * PLAYER_MOVE_SPEED;
        this.player.dy += yControl * PLAYER_MOVE_SPEED;
        let moveControl = xControl || yControl;
        if (moveControl)
        {
            if (!xControl) this.player.dx *= INV_PLAYER_BRAKE_FRICTION;
            if (!yControl) this.player.dy *= INV_PLAYER_BRAKE_FRICTION;
        }

        if (toggleBrakeControl) this.player.brakeMode = !this.player.brakeMode;
        if (!moveControl && this.player.brakeMode || brakeControl)
        {
            this.player.dx *= INV_PLAYER_BRAKE_FRICTION;
            this.player.dy *= INV_PLAYER_BRAKE_FRICTION;
        }

        this.player.dx = Utils.clampRange(this.player.dx, -MAX_PLAYER_VELOCITY_X, MAX_PLAYER_VELOCITY_X);
        this.player.dy = Utils.clampRange(this.player.dy, -MAX_PLAYER_VELOCITY_Y, MAX_PLAYER_VELOCITY_Y);
        this.player.x += this.player.dx;
        this.player.y += this.player.dy;

        for(let gravityWell of this.gravityWells)
        {
            let dist = Utils.distance2D(this.player, gravityWell);
            let maxDist = gravityWell.magnitude * GRAVITY_MAGNITUDE_FACTOR;
            if (dist < maxDist)
            {
                let dir = Utils.direction2D(this.player, gravityWell);
                let mag = Utils.clampRange(1 - (dist / maxDist), 0, 0.4);
                let dx = Math.cos(dir) * mag * mag;
                let dy = Math.sin(dir) * mag * mag;
                this.player.dx += dx;
                this.player.dy += dy;
                this.player.x += dx;
                this.player.y += dy;
            }
        }

        if (this.player.dx || this.player.dy)
        {
            this.player.rotation = Utils.lookAt2D(this.player.rotation, Math.atan2(this.player.dy, this.player.dx), PLAYER_ROT_SPEED);
        }

        updateCarts(this);
        updatePlanets(this, dt);
    }
    this.render(Views.WORLD_VIEW);
}

function render(view)
{
    let ctx = view.context;
    Utils.clearScreen(ctx, view.width, view.height);
    {
        Utils.drawBox(ctx, this.player.x, this.player.y, this.player.rotation, 16, 16, 'red');
        Utils.drawBox(ctx, this.player.x, this.player.y, this.player.rotation, 12, 4, 'white');

        for(let cart of this.carts)
        {
            Utils.drawBox(ctx, cart.x, cart.y, cart.rotation, 16, 16, 'yellow');
        }

        for(let planet of this.planets)
        {
            Utils.drawBox(ctx, planet.x, planet.y, planet.rotation, planet.radius, planet.radius, 'green');
        }

        for(let gravityWell of this.gravityWells)
        {
            Utils.drawCircle(ctx, gravityWell.x, gravityWell.y, gravityWell.magnitude * GRAVITY_MAGNITUDE_FACTOR, 'yellow', true);
        }
    }
    Display.drawBufferToScreen(ctx);
}

function createGravityWell(world, x = 0, y = 0, magnitude = 1)
{
    let result = {
        x, y,
        magnitude
    };
    world.gravityWells.push(result);
    return result;
}

function createPlanet(world, x = 0, y = 0, radius = 32)
{
    let result = {
        x, y,
        rotation: 0,
        dr: Random.randomSign() * Random.randomRange(MIN_PLANET_ROT_SPEED, MAX_PLANET_ROT_SPEED),
        radius
    };
    world.planets.push(result);
    return result;
}

function updatePlanets(world, dt)
{
    for(let planet of world.planets)
    {
        planet.rotation += planet.dr * dt;
        planet.rotation %= Math.PI * 2;
    }
}

function createCartSequence(world, head = null, amount = 1)
{
    let result = [];
    let prev = head;
    let x = prev ? prev.x : 0;
    let y = prev ? prev.y : 0;
    for(; amount > 0; --amount)
    {
        prev = createCart(world, x, y, prev);
        result.push(prev);
    }
    return result;
}

function createCart(world, x = 0, y = 0, target = null)
{
    let result = {
        x,
        y,
        rotation: 0,
        target
    };
    world.carts.push(result);
    return result;
}

function updateCarts(world)
{
    for(let cart of world.carts)
    {
        let target = cart.target;
        if (!target) continue;

        let dx = target.x - cart.x;
        let dy = target.y - cart.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length > 16)
        {
            cart.x = Utils.lerp(cart.x, target.x, CART_SPEED);
            cart.y = Utils.lerp(cart.y, target.y, CART_SPEED);
            cart.rotation = Utils.lookAt2D(cart.rotation, Math.atan2(dy, dx), CART_ROT_SPEED);
        }
    }
}

GameLoop.start({ start, update, render });
