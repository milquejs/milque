import { Random } from '@milque/random';
import { ComponentClass, Query } from '@milque/scene';

import { ASTEROID_SPEED, calculateAsteroidSpawnRanges } from './Asteroid.js';
import { AsteroidGame, useNextLevel } from './AsteroidGame.js';
import { explode } from './Explode.js';
import { useSystem } from './lib/M.js';
import { EntityManagerProvider } from './main.js';
import { PLAYER_RADIUS } from './Player.js';
import { drawCollisionCircle, withinRadius, wrapAround } from './util.js';

/**
 * @typedef {import('@milque/scene').EntityId} EntityId
 */

export const POWER_UP_RADIUS = 4;
const POWER_UP_SPAWN_RATE = [10_000, 30_000];
const POWER_UP_EXPLODE_PARTICLE_COLORS = ['white', 'violet', 'violet'];
const POWER_UP_AMOUNT = 30;
const POWER_UP_SPAWN_CHANCE = 0.7;

export const PowerUp = new ComponentClass('PowerUp', () => ({
  x: 0, y: 0,
  dx: 0, dy: 0,
  rotation: 0,
}));
export const PowerUpQuery = new Query(PowerUp);

export function PowerUpSystem(m) {
  const ents = useSystem(m, EntityManagerProvider);
  const scene = useSystem(m, AsteroidGame);

  useNextLevel(m, () => {
    ents.clear(PowerUp);
    if (Random.next() > POWER_UP_SPAWN_CHANCE) {
      scene.powerUpSpawner.spawn(scene);
    }
  });
}

/**
 * @param {AsteroidGame} scene 
 * @param {number} x 
 * @param {number} y 
 * @param {number} dx 
 * @param {number} dy
 */
export function createPowerUp(scene, x, y, dx, dy) {
  return {
    scene,
    x, y,
    dx, dy,
    rotation: Math.atan2(dy, dx),
  };
}

/**
 * @param {AsteroidGame} scene 
 * @param {number} x 
 * @param {number} y 
 * @param {number} dx 
 * @param {number} dy 
 */
export function spawnPowerUp(scene, x, y, dx, dy) {
  let entityId = scene.ents.create();
  let powerUp = scene.ents.attach(entityId, PowerUp);
  powerUp.x = x;
  powerUp.y = y;
  powerUp.dx = dx;
  powerUp.dy = dy;
  powerUp.rotation = Math.atan2(dy, dx);
  return entityId;
}

/**
 * @param {AsteroidGame} scene 
 * @param {EntityId} entityId
 */
export function destroyPowerUp(scene, entityId) {
  scene.ents.destroy(entityId);
}

/**
 * @param {AsteroidGame} scene 
 */
export function updatePowerUps(dt, scene) {
  // Update motion
  for (let [_, powerUp] of PowerUpQuery.findAll(scene.ents)) {
    powerUp.x += powerUp.dx;
    powerUp.y += powerUp.dy;

    // Wrap around
    wrapAround(scene.canvas, powerUp, POWER_UP_RADIUS * 2, POWER_UP_RADIUS * 2);
  }

  // Update collision
  for (let [entityId, powerUp] of PowerUpQuery.findAll(scene.ents)) {
    if (withinRadius(powerUp, scene.player, POWER_UP_RADIUS + PLAYER_RADIUS)) {
      explode(
        scene,
        powerUp.x,
        powerUp.y,
        10,
        Random.choose.bind(null, POWER_UP_EXPLODE_PARTICLE_COLORS)
      );
      destroyPowerUp(scene, entityId);
      scene.player.powerMode += POWER_UP_AMOUNT;
      break;
    }
  }
}

/**
 * @param {AsteroidGame} scene 
 */
export function drawPowerUps(ctx, scene) {
  for (let [_, powerUp] of PowerUpQuery.findAll(scene.ents)) {
    ctx.translate(powerUp.x, powerUp.y);
    ctx.rotate(powerUp.rotation);
    ctx.beginPath();
    ctx.strokeStyle = 'violet';
    ctx.arc(0, 0, POWER_UP_RADIUS, 0, Math.PI * 2);
    ctx.moveTo(-POWER_UP_RADIUS / 2, 0);
    ctx.lineTo(POWER_UP_RADIUS / 2, 0);
    ctx.moveTo(0, -POWER_UP_RADIUS / 2);
    ctx.lineTo(0, POWER_UP_RADIUS / 2);
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    drawCollisionCircle(ctx, powerUp.x, powerUp.y, POWER_UP_RADIUS);
  }
}

/**
 * @param {AsteroidGame} scene 
 */
export function createPowerUpSpawner(scene) {
  return {
    scene,
    reset() {
      // Do nothing.
    },
    spawn(scene) {
      let spawnRange = Random.choose(calculateAsteroidSpawnRanges(scene.display));
      createPowerUp(
        scene,
        // X range
        Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
        // Y range
        Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED)
      );
    },
  };
}

/**
 * @param {AsteroidGame} scene 
 */
export function updatePowerUpSpawner(dt, scene, spawner) {
  // Do nothing.
}
