import { AssetRef } from '@milque/asset';
import { ComponentClass, EntityManager, EntityQuery } from '@milque/scene';

import { ASTEROID_BREAK_DAMP_FACTOR, breakUpAsteroid, explodeAsteroid } from './Asteroid.js';
import { AsteroidGame, useNextLevel } from './AsteroidGame.js';
import { usePreloadedAssets, useSystem } from './lib/M.js';
import { DisplayPortProvider, EntityManagerProvider, useDraw, useUpdate } from './main.js';
import { loadSound } from './SoundLoader.js';
import { drawCollisionCircle, withinRadius, wrapAround } from './util.js';

export const BULLET_SPEED = 4;
export const MAX_BULLET_COUNT = 100;
const BULLET_RADIUS = 2;
const BULLET_COLOR = 'gold';
const MAX_BULLET_AGE = 2000;

export const BULLET_DRAW_LAYER_INDEX = 5;

export const BulletPopSound = new AssetRef('bullet.pop', loadSound, undefined, 'raw://boop.wav');

export const Bullet = new ComponentClass('Bullet', () => ({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    rotation: 0,
    age: 0,
}));
export const BulletQuery = new EntityQuery(Bullet);

export function BulletSystem(m) {
    const ents = useSystem(m, EntityManagerProvider);
    const { canvas } = useSystem(m, DisplayPortProvider);
    const scene = useSystem(m, AsteroidGame);
    usePreloadedAssets(m, [
        BulletPopSound
    ]);

    useNextLevel(m, () => {
        ents.clear(Bullet);
    });

    useUpdate(m, ({ deltaTime: dt }) => {
        onUpdate(dt, scene, canvas, ents);
    });

    useDraw(m, BULLET_DRAW_LAYER_INDEX, (ctx) => {
        onDraw(ctx, ents);
    });

    return {
        spawnBullet,
    };
}

/**
 * @param {number} dt 
 * @param {AsteroidGame} scene 
 * @param {HTMLCanvasElement} canvas
 * @param {EntityManager} ents
 */
function onUpdate(dt, scene, canvas, ents) {
    if (scene.gamePause) {
        return;
    }

    // Update bullet motion
    for (let [entityId, bullet] of BulletQuery.findAll(ents)) {
        bullet.age += dt;
        if (bullet.age > MAX_BULLET_AGE) {
            ents.destroy(entityId);
        } else {
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            // Wrap around
            wrapAround(canvas, bullet, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
        }
    }

    // Update bullet collision
    for (let [entityId, bullet] of BulletQuery.findAll(ents)) {
        for (let asteroid of scene.asteroids) {
            if (withinRadius(bullet, asteroid, asteroid.size)) {
                scene.flashScore = 1;
                scene.score++;
                if (scene.score > scene.highScore) {
                    scene.flashHighScore = scene.score - scene.highScore;
                    scene.highScore = scene.score;
                    localStorage.setItem('highscore', `${scene.highScore}`);
                }
                explodeAsteroid(scene, asteroid);
                BulletPopSound.current.play();
                ents.destroy(entityId);
                breakUpAsteroid(
                    scene,
                    asteroid,
                    bullet.dx * ASTEROID_BREAK_DAMP_FACTOR,
                    bullet.dy * ASTEROID_BREAK_DAMP_FACTOR
                );
                break;
            }
        }
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 */
function onDraw(ctx, ents) {
    for (let [_, bullet] of BulletQuery.findAll(ents)) {
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.rotation);
        ctx.fillStyle = BULLET_COLOR;
        ctx.fillRect(
            -BULLET_RADIUS,
            -BULLET_RADIUS,
            BULLET_RADIUS * 4,
            BULLET_RADIUS * 2
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        drawCollisionCircle(ctx, bullet.x, bullet.y, BULLET_RADIUS);
    }
}

/**
 * @param {AsteroidGame} scene 
 * @param {number} x 
 * @param {number} y 
 * @param {number} dx 
 * @param {number} dy 
 */
export function spawnBullet(scene, x, y, dx, dy) {
    let [entityId, bullet] = scene.ents.createAndAttach(Bullet);
    bullet.x = x;
    bullet.y = y;
    bullet.dx = dx;
    bullet.dy = dy;
    bullet.rotation = Math.atan2(dy, dx);
    bullet.age = 0;
    return entityId;
}

/**
 * @param {AsteroidGame} scene
 */
export function countBullets(scene) {
    return scene.ents.count(Bullet);
}
