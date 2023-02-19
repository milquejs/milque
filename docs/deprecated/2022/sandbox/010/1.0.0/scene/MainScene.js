import { Utils } from '../milque.js';

import * as Asteroid from '../entity/Asteroid.js';
import * as Player from '../entity/Player.js';
import * as Cart from '../entity/Cart.js';
import * as Planet from '../entity/Planet.js';

/**
 * There's an asteroid field around a system.
 * You need to gather enough fuel to jump.
 * You can find fuel among wreakage, get them off of enemies, or trade for them.
 * You can also trade for money. This is used to buy upgrades.
 */

export async function load() {
  await Cart.load();
  await Planet.load();
  await Player.load();
  await Asteroid.load();
}

export function unload() {
  Cart.unload();
  Planet.unload();
  Player.unload();
  Asteroid.unload();
}

export function onStart() {
  this.carts = [];
  this.players = [];
  this.planets = [];
  this.asteroids = [];

  this.camera = {
    x: 0,
    y: 0,
    speed: 1,
    rotation: 0,
    scale: 1,
    target: null,
    update(dt) {
      if (this.target) {
        this.x = Utils.lerp(this.x, this.target.x, this.speed * dt);
        this.y = Utils.lerp(this.y, this.target.y, this.speed * dt);
      }
    },
  };

  this.player = Player.spawn(this);
  Cart.spawnSequence(this, this.player, 4);
  Planet.spawn(this, 100, 100);

  this.camera.target = this.player;
}

export function onPreUpdate(dt) {
  Cart.onPreUpdate(dt, this, this.carts);
  Planet.onPreUpdate(dt, this, this.planets);
  Player.onPreUpdate(dt, this, this.players);
  Asteroid.onPreUpdate(dt, this, this.asteroids);
}

export function onUpdate(dt) {
  Cart.onUpdate(dt, this, this.carts);
  Planet.onUpdate(dt, this, this.planets);
  Player.onUpdate(dt, this, this.players);
  Asteroid.onUpdate(dt, this, this.asteroids);

  this.camera.update(dt);
}

export function onRender(view, world) {
  let ctx = view.context;
  let centerX = view.width / 2;
  let centerY = view.height / 2;
  ctx.translate(-world.camera.x + centerX, -world.camera.y + centerY);
  {
    Planet.onRender(view, world, world.planets);
    Cart.onRender(view, world, world.carts);
    Player.onRender(view, world, world.players);
  }
  ctx.translate(world.camera.x - centerX, world.camera.y - centerY);
}
