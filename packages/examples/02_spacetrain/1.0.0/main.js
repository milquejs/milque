import { GameLoop, Input, Display, Utils } from './milque.js';

import * as Views from './Views.js';
import * as Cart from './Cart.js';
import * as Player from './Player.js';
import * as Planet from './Planet.js';

const CAMERA_SPEED = 0.1;

function start()
{
    this.carts = [];
    this.players = [];
    this.planets = [];
    this.camera = {
        x: 0,
        y: 0,
        target: null
    };

    this.player = Player.create(this);
    Cart.createSequence(this, this.player, 4);
    Planet.create(this, 100, 100);

    this.camera.target = this.player;
}

function update(dt)
{
    Cart.onPreUpdate(dt, this, this.carts);
    Planet.onPreUpdate(dt, this, this.planets);
    Player.onPreUpdate(dt, this, this.players);

    Input.poll();

    Cart.onUpdate(dt, this, this.carts);
    Planet.onUpdate(dt, this, this.planets);
    Player.onUpdate(dt, this, this.players);

    Cart.onPostUpdate(dt, this, this.carts);
    Planet.onPostUpdate(dt, this, this.planets);
    Player.onPostUpdate(dt, this, this.players);

    if (this.camera.target)
    {
        this.camera.x = Utils.lerp(this.camera.x, this.camera.target.x, CAMERA_SPEED);
        this.camera.y = Utils.lerp(this.camera.y, this.camera.target.y, CAMERA_SPEED);
    }

    this.render(Views.WORLD_VIEW);
}

function render(view)
{
    let ctx = view.context;
    Utils.clearScreen(ctx, view.width, view.height);

    let centerX = Views.WORLD_VIEW.width / 2;
    let centerY = Views.WORLD_VIEW.height / 2;
    ctx.translate(-this.camera.x + centerX, -this.camera.y + centerY);
    {
        Planet.onRender(view, this, this.planets);
        Cart.onRender(view, this, this.carts);
        Player.onRender(view, this, this.players);
    }
    ctx.translate(this.camera.x - centerX, this.camera.y - centerY);

    Display.drawBufferToScreen(ctx);
}

Promise.all([
    Cart.load(),
    Planet.load(),
    Player.load(),
]).then(() => {
    GameLoop.start({ start, update, render });
});
