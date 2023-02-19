import { Random } from '@milque/random';
import { AsteroidGame, useNextLevel } from './AsteroidGame.js';
import { explode } from './Explode.js';
import { useSystem } from './lib/M.js';
import { PLAYER_RADIUS, killPlayer } from './Player.js';
import { drawCollisionCircle, withinRadius, wrapAround } from './util.js';

/**
 * @typedef {import('./AsteroidGame.js').AsteroidGame} AsteroidGame
 */

export const ASTEROID_SPEED = 1;
export const ASTEROID_BREAK_DAMP_FACTOR = 0.1;
const SMALL_ASTEROID_RADIUS = 4;
const MAX_ASTEROID_COUNT = 100;
const ASTEROID_SPAWN_INIT_COUNT = 1;
const ASTEROID_RADIUS = 8;

/** @knob range */
const ASTEROID_SPAWN_RATE = { MIN: 3_000, MAX: 10_000 };
const ASTEROID_SPAWN_RATE_RAND = (/** @type {Random} */ r) => r.range(
    ASTEROID_SPAWN_RATE.MIN,
    ASTEROID_SPAWN_RATE.MAX);

const ASTEROID_EXPLODE_PARTICLE_COLORS = [
    'blue',
    'blue',
    'blue',
    'dodgerblue',
    'gray',
    'darkgray',
    'yellow',
];

export function AsteroidSystem(m) {
    const scene = useSystem(m, AsteroidGame);
    useNextLevel(m, () => {
        scene.asteroids.length = 0;
        for (let i = 0; i < ASTEROID_SPAWN_INIT_COUNT * scene.level; ++i) {
            scene.asteroidSpawner.spawn(scene);
        }
    });
}

/**
 * @param {AsteroidGame} scene 
 */
export function breakUpAsteroid(scene, asteroid, dx = 0, dy = 0) {
    destroyAsteroid(scene, asteroid);
    if (asteroid.size > SMALL_ASTEROID_RADIUS) {
        let children = [];
        children.push(
            spawnAsteroid(
                scene,
                asteroid.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                asteroid.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                SMALL_ASTEROID_RADIUS
            )
        );
        children.push(
            spawnAsteroid(
                scene,
                asteroid.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                asteroid.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                SMALL_ASTEROID_RADIUS
            )
        );
        children.push(
            spawnAsteroid(
                scene,
                asteroid.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                asteroid.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                SMALL_ASTEROID_RADIUS
            )
        );
        children.push(
            spawnAsteroid(
                scene,
                asteroid.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                asteroid.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                SMALL_ASTEROID_RADIUS
            )
        );
        scene.asteroids.push(...children);
    }
}

export function spawnAsteroid(scene, x, y, dx, dy, size) {
    return {
        scene,
        x, y, 
        dx, dy,
        size, 
        rotation: Math.atan2(dy, dx),
    };
}

/**
 * 
 * @param {AsteroidGame} scene 
 * @param {ReturnType<spawnAsteroid>} asteroid 
 */
export function destroyAsteroid(scene, asteroid) {
    scene.asteroids.splice(scene.asteroids.indexOf(asteroid), 1);
}

/**
 * @param {AsteroidGame} scene 
 */
export function createAsteroidSpawner(scene) {
    return {
        scene,
        spawnTicks: ASTEROID_SPAWN_RATE.MAX,
        reset() {
            this.spawnTicks = ASTEROID_SPAWN_RATE.MAX;
        },
        spawn(scene) {
            if (scene.asteroids.length > MAX_ASTEROID_COUNT) return;
            let spawnRange = Random.choose(calculateAsteroidSpawnRanges(scene.display));
            let asteroid = spawnAsteroid(
                scene,
                // X range
                Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
                // Y range
                Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
                ASTEROID_RADIUS
            );
            scene.asteroids.push(asteroid);
        },
    };
}

/**
 * @param {number} dt
 * @param {AsteroidGame} scene 
 */
export function updateAsteroidSpawner(dt, scene, spawner) {
    if (scene.gamePause) {
        return;
    }

    spawner.spawnTicks -= dt;
    if (spawner.spawnTicks <= 0) {
        spawner.spawn(scene);
        spawner.spawnTicks = ASTEROID_SPAWN_RATE_RAND(Random.RAND);
    }
}

/**
 * @param {number} dt
 * @param {AsteroidGame} scene 
 * @param {Array<ReturnType<spawnAsteroid>>} asteroids
 */
export function updateAsteroids(dt, scene, asteroids) {
    // Update asteroid motion
    for (let asteroid of asteroids) {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;
        wrapAround(scene.canvas, asteroid, asteroid.size * 2, asteroid.size * 2);
    }

    // Update asteroid collision
    for (let asteroid of asteroids) {
        if (withinRadius(asteroid, scene.player, asteroid.size + PLAYER_RADIUS)) {
            explodeAsteroid(scene, asteroid);
            destroyAsteroid(scene, asteroid);
            killPlayer(scene, scene.player);
            break;
        }
    }
}

export function explodeAsteroid(scene, asteroid) {
    explode(
        scene,
        asteroid.x,
        asteroid.y,
        10,
        Random.choose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS)
    );
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {AsteroidGame} scene 
 * @param {Array<ReturnType<spawnAsteroid>>} asteroids
 */
export function drawAsteroids(ctx, scene, asteroids) {
    for (let asteroid of asteroids) {
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.fillStyle = 'slategray';
        ctx.fillRect(
            -asteroid.size,
            -asteroid.size,
            asteroid.size * 2,
            asteroid.size * 2
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        drawCollisionCircle(ctx, asteroid.x, asteroid.y, asteroid.size);
    }
}

export function calculateAsteroidSpawnRanges(display) {
    return [
        [
            -ASTEROID_RADIUS,
            -ASTEROID_RADIUS,
            ASTEROID_RADIUS * 2 + display.width,
            ASTEROID_RADIUS,
        ],
        [-ASTEROID_RADIUS, 0, ASTEROID_RADIUS, display.height],
        [
            -ASTEROID_RADIUS,
            display.height,
            ASTEROID_RADIUS * 2 + display.width,
            ASTEROID_RADIUS,
        ],
        [display.width, 0, ASTEROID_RADIUS, display.height],
    ];
}
