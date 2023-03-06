import { ComponentClass, Query } from '@milque/scene';

import { useNextLevel } from './AsteroidGame.js';
import { useSystem } from './lib/M';
import { DisplayPortProvider, EntityManagerProvider, useDraw, useUpdate } from './main.js';
import { wrapAround } from './util.js';

/**
 * @typedef {import('./AsteroidGame.js').AsteroidGame} AsteroidGame
 * @typedef {import('@milque/scene').EntityId} EntityId
 * @typedef {import('@milque/scene').EntityManager} EntityManager
 */

export const PARTICLE_RADIUS = 4;
export const PARTICLE_SPEED = 2;
export const MAX_PARTICLE_AGE = 600;

export const PARTICLES_DRAW_LAYER_INDEX = 9;

export const Particle = new ComponentClass('Particle', () => ({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    rotation: 0,
    age: 0,
    color: 'white',
}));
export const ParticleQuery = new Query(Particle);

/**
 * @param {import('./lib/M').M} m 
 */
export function ParticleSystem(m) {
    const ents = useSystem(m, EntityManagerProvider);
    const { canvas } = useSystem(m, DisplayPortProvider);

    useNextLevel(m, () => {
        ents.clear(Particle);
    });

    useUpdate(m, ({ deltaTime: dt }) => {
        // Update particle motion
        for (let [entityId, particle] of ParticleQuery.findAll(ents)) {
            particle.age += dt;
            if (particle.age > MAX_PARTICLE_AGE) {
                ents.destroy(entityId);
            } else {
                particle.x += particle.dx;
                particle.y += particle.dy;
    
                // Wrap around
                wrapAround(canvas, particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
            }
        }
    });

    useDraw(m, PARTICLES_DRAW_LAYER_INDEX, (ctx) => {
        for (let [_, particle] of ParticleQuery.findAll(ents)) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillStyle = particle.color;
            let size = PARTICLE_RADIUS * (1 - particle.age / MAX_PARTICLE_AGE);
            ctx.fillRect(-size, -size, size * 2, size * 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    });
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
    let entityId = scene.ents.create();
    let particle = scene.ents.attach(entityId, Particle);
    particle.x = x;
    particle.y = y;
    particle.dx = dx;
    particle.dy = dy;
    particle.rotation = Math.atan2(dy, dx);
    particle.age = age;
    particle.color = color;
    return entityId;
}
