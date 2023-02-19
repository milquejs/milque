import { Random } from '@milque/random';
import { Assets } from './assets.js';
import { AsteroidGame, useNextLevel } from './AsteroidGame';
import { BULLET_SPEED, countBullets, MAX_BULLET_COUNT, spawnBullet } from './Bullet.js';
import { explode } from './Explode.js';
import { ComponentClass, EntityManager, EntityQuery } from '@milque/scene';

import { useSystem } from './lib/M.js';
import { DisplayPortProvider, EntityManagerProvider, useDraw, useUpdate } from './main.js';
import { MAX_PARTICLE_AGE, spawnParticle } from './Particle.js';
import { FLASH_TIME_STEP, wrapAround } from './util.js';

export const PLAYER_RADIUS = 5;
const PLAYER_MOVE_PARTICLE_OFFSET_RANGE = [-2, 2];
const MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.1;
const MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.4;
const PLAYER_EXPLODE_PARTICLE_COLORS = [
    'red',
    'red',
    'red',
    'yellow',
    'orange',
];
export const PLAYER_MOVE_PARTICLE_COLORS = ['gray', 'darkgray', 'lightgray'];
const PLAYER_SHOOT_COOLDOWN = 10;
const PLAYER_MOVE_PARTICLE_DAMP_FACTOR = 1.5;

const PLAYER_MOVE_SPEED = 0.02;
const PLAYER_ROT_SPEED = 0.008;
const PLAYER_ROT_FRICTION = 0.1;
const PLAYER_MOVE_FRICTION = 0.001;

export const PLAYER_DRAW_LAYER_INDEX = 10;

export const Player = new ComponentClass('Player', () => ({
    x: 0, 
    y: 0,
    rotation: 0,
    dx: 0,
    dy: 0,
    dr: 0,
    left: 0,
    right: 0,
    up: 0,
    down: 0,
    fire: 0,
    cooldown: 0,
    powerMode: 0,
}));
export const PlayerQuery = new EntityQuery(Player);

/**
 * @param {import('./lib/M').M} m 
 */
export function PlayerSystem(m) {
    const { canvas } = useSystem(m, DisplayPortProvider);
    const ents = useSystem(m, EntityManagerProvider);
    const scene = useSystem(m, AsteroidGame);

    let player = spawnPlayer(canvas, ents);
    scene.player = player;

    useNextLevel(m, () => {
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        player.dx = 0;
        player.dy = 0;
    });

    useUpdate(m, ({ deltaTime }) => {
        if (scene.gamePause) {
            return;
        }
        updatePlayer(deltaTime, scene);
    });

    useDraw(m, PLAYER_DRAW_LAYER_INDEX, (ctx) => {
        if (!scene.showPlayer) {
            return;
        }
        drawPlayer(ctx, scene);
    });
    return player;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {EntityManager} ents
 */
function spawnPlayer(canvas, ents) {
    let [_, player] = ents.createAndAttach(Player);
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    return player;
}

/**
 * @param {number} dt 
 * @param {AsteroidGame} scene 
 */
function updatePlayer(dt, scene) {
    let [_, player] = PlayerQuery.find(scene.ents);
    if (!player) {
        return;
    }

    // Determine control
    const rotControl = player.right - player.left;
    const moveControl = player.down - player.up;
    const fireControl = player.fire;

    // Calculate velocity
    player.dx +=
        moveControl * Math.cos(player.rotation) * PLAYER_MOVE_SPEED;
    player.dy +=
        moveControl * Math.sin(player.rotation) * PLAYER_MOVE_SPEED;
    player.dx *= 1 - PLAYER_MOVE_FRICTION;
    player.dy *= 1 - PLAYER_MOVE_FRICTION;

    // Calculate angular velocity
    player.dr += rotControl * PLAYER_ROT_SPEED;
    player.dr *= 1 - PLAYER_ROT_FRICTION;

    // Calculate position
    player.x += player.dx;
    player.y += player.dy;
    player.rotation += player.dr;

    --player.cooldown;

    // Wrap around
    wrapAround(scene.canvas, player, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);

    // Whether to fire a bullet
    if (fireControl) {
        shootPlayer(scene, player);
        scene.flashShootDelta = 1;
    }

    // Whether to spawn thruster particles
    if (moveControl) {
        thrust(
            scene,
            player.x,
            player.y,
            -moveControl *
            Math.cos(player.rotation) *
            PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
            -moveControl *
            Math.sin(player.rotation) *
            PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
            Random.choose.bind(null, PLAYER_MOVE_PARTICLE_COLORS)
        );
    }
}

function drawPlayer(ctx, scene) {
    let [_, player] = PlayerQuery.find(scene.ents);
    if (!player) {
        return;
    }
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);
    ctx.fillStyle = 'white';
    let size = PLAYER_RADIUS;
    ctx.fillRect(-size, -size, size * 2, size * 2);
    let xOffset = -1;
    let yOffset = 0;
    let sizeOffset = 0;
    if (scene.flashShootDelta > 0) {
        ctx.fillStyle = `rgb(${200 * scene.flashShootDelta +
            55 * Math.sin(performance.now() / (PLAYER_SHOOT_COOLDOWN * 2))
            }, 0, 0)`;
        scene.flashShootDelta -= FLASH_TIME_STEP;
        sizeOffset = scene.flashShootDelta * 2;
        xOffset = scene.flashShootDelta;
    } else {
        ctx.fillStyle = 'black';
    }
    ctx.fillRect(
        -size - sizeOffset / 2 + xOffset,
        -(size / 4) - sizeOffset / 2 + yOffset,
        size + sizeOffset,
        size / 2 + sizeOffset
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function shootPlayer(scene, player) {
    if (countBullets(scene) > MAX_BULLET_COUNT) return;
    if (player.cooldown > 0) return;
    if (player.powerMode > 0) {
        for (let i = -1; i <= 1; ++i) {
            let rotation = player.rotation + (i * Math.PI) / 4;
            spawnBullet(
                scene,
                player.x - Math.cos(rotation) * PLAYER_RADIUS,
                player.y - Math.sin(rotation) * PLAYER_RADIUS,
                -Math.cos(rotation) * BULLET_SPEED + player.dx,
                -Math.sin(rotation) * BULLET_SPEED + player.dy
            );
        }
        --player.powerMode;
    } else {
        spawnBullet(
            scene,
            player.x - Math.cos(player.rotation) * PLAYER_RADIUS,
            player.y - Math.sin(player.rotation) * PLAYER_RADIUS,
            -Math.cos(player.rotation) * BULLET_SPEED + player.dx,
            -Math.sin(player.rotation) * BULLET_SPEED + player.dy
        );
    }
    player.cooldown = PLAYER_SHOOT_COOLDOWN;
    Assets.SoundShoot.current.play();
}

export function killPlayer(scene, player) {
    scene.gamePause = true;
    scene.showPlayer = false;
    explode(
        scene,
        player.x,
        player.y,
        100,
        Random.choose.bind(null, PLAYER_EXPLODE_PARTICLE_COLORS)
    );
    Assets.SoundDead.current.play();
    Assets.SoundBoom.current.play();
    setTimeout(() => (scene.gameStart = scene.gameWait = true), 1000);
}

export function thrust(scene, x, y, dx, dy, color) {
    if (Random.next() > 0.3) {
        spawnParticle(
            scene,
            x + Random.range(PLAYER_MOVE_PARTICLE_OFFSET_RANGE[0], PLAYER_MOVE_PARTICLE_OFFSET_RANGE[1]),
            y + Random.range(PLAYER_MOVE_PARTICLE_OFFSET_RANGE[0], PLAYER_MOVE_PARTICLE_OFFSET_RANGE[1]),
            dx,
            dy,
            color,
            Random.range(
                MAX_PARTICLE_AGE * MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO,
                MAX_PARTICLE_AGE * MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO
            )
        );
    }
}
