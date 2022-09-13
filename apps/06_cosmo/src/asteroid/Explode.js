import { Random } from '@milque/random';
import { PARTICLE_SPEED, spawnParticle } from './Particle.js';

export function explode(scene, x, y, amount = 10, color) {
    for (let i = 0; i < amount; ++i) {
        spawnParticle(
            scene,
            x,
            y,
            Random.range(-1, 1) * PARTICLE_SPEED,
            Random.range(-1, 1) * PARTICLE_SPEED,
            color
        );
    }
}
