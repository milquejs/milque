import { Random } from '@milque/random';
import { ASSETS } from './Assets.js';

export const PLAYER_RADIUS = 5;

const PARTICLE_SPEED = 2;
const PLAYER_EXPLODE_PARTICLE_COLORS = [
    'red',
    'red',
    'red',
    'yellow',
    'orange',
];

export function wrapAround(world, position, width, height) {
    let canvasWidth = world.canvas.width;
    let canvasHeight = world.canvas.height;
    if (position.x < -width) position.x = canvasWidth;
    if (position.y < -height) position.y = canvasHeight;
    if (position.x > canvasWidth + width / 2) position.x = -width;
    if (position.y > canvasHeight + height / 2) position.y = -height;
}

export function withinRadius(from, to, radius) {
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius;
}

export function drawCollisionCircle(ctx, x, y, radius) {
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'lime';
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function explode(scene, x, y, amount = 10, color) {
    for (let i = 0; i < amount; ++i) {
        scene.particles.push(
            createParticle(
                scene,
                x,
                y,
                Random.range(-1, 1) * PARTICLE_SPEED,
                Random.range(-1, 1) * PARTICLE_SPEED,
                color
            )
        );
    }
}

export function createParticle(scene, x, y, dx, dy, color) {
    if (typeof color === 'function') color = color.call(null);
    return {
        scene,
        x,
        y,
        dx,
        dy,
        rotation: Math.atan2(dy, dx),
        age: 0,
        color,
        destroy() {
            this.scene.particles.splice(this.scene.particles.indexOf(this), 1);
        },
    };
}

export function killPlayer(scene) {
    scene.gamePause = true;
    scene.showPlayer = false;
    explode(
        scene,
        scene.player.x,
        scene.player.y,
        100,
        Random.choose.bind(null, PLAYER_EXPLODE_PARTICLE_COLORS)
    );
    ASSETS.SoundDead.current.play();
    ASSETS.SoundBoom.current.play();
    setTimeout(() => (scene.gameStart = scene.gameWait = true), 1000);
}
