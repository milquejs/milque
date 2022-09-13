import { ComponentClass, EntityQuery } from './lib/EntityManager.js';
import { wrapAround } from './util.js';

/**
 * @typedef {import('./main.js').AsteroidGame} AsteroidGame
 * @typedef {import('./lib/EntityManager.js').EntityId} EntityId
 */

export const PARTICLE_RADIUS = 4;
export const PARTICLE_SPEED = 2;
export const MAX_PARTICLE_AGE = 600;

export const Particle = new ComponentClass('Particle', () => ({
    x: 0, y: 0,
    dx: 0, dy: 0,
    rotation: 0,
    age: 0,
    color: 'white',
}));
export const ParticleQuery = new EntityQuery(Particle);

/**
 * @param {AsteroidGame} scene 
 */
export function onNextLevelParticle(scene) {
    scene.ents.clear(Particle);
}

/**
 * @param {AsteroidGame} scene 
 * @param {number} x 
 * @param {number} y 
 * @param {number} dx 
 * @param {number} dy 
 * @param {string|(() => string)} color 
 */
export function spawnParticle(scene, x, y, dx, dy, color, age = 0) {
    if (typeof color === 'function') color = color();
    let [entityId, particle] = scene.ents.create(Particle);
    particle.x = x;
    particle.y = y;
    particle.dx = dx;
    particle.dy = dy;
    particle.rotation = Math.atan2(dy, dx);
    particle.age = age;
    particle.color = color;
    return entityId;
}

/**
 * @param {AsteroidGame} scene 
 * @param {EntityId} entityId 
 */
export function destroyParticle(scene, entityId) {
    scene.ents.destroy(entityId);
}

export function updateParticles(dt, scene) {
    // Update particle motion
    for (let [entityId, particle] of ParticleQuery.findAll(scene.ents)) {
        particle.age += dt;
        if (particle.age > MAX_PARTICLE_AGE) {
            destroyParticle(scene, entityId);
        } else {
            particle.x += particle.dx;
            particle.y += particle.dy;

            // Wrap around
            wrapAround(scene, particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        }
    }
}

export function drawParticles(ctx, scene) {
    for (let [_, particle] of ParticleQuery.findAll(scene.ents)) {
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        let size = PARTICLE_RADIUS * (1 - particle.age / MAX_PARTICLE_AGE);
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
