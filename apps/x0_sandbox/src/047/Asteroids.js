import { Random } from '@milque/random';
import { drawCollisionCircle, explode, killPlayer, PLAYER_RADIUS, withinRadius, wrapAround } from './Util';

export const ASTEROID_SPAWN_RATE = [3000, 10000];
export const SMALL_ASTEROID_RADIUS = 4;
export const MAX_ASTEROID_COUNT = 100;
export const ASTEROID_SPEED = 1;
export const ASTEROID_RADIUS = 8;
export const ASTEROID_SPAWN_INIT_COUNT = 1;
export const ASTEROID_EXPLODE_PARTICLE_COLORS = [
    'blue',
    'blue',
    'blue',
    'dodgerblue',
    'gray',
    'darkgray',
    'yellow',
];
export const ASTEROID_BREAK_DAMP_FACTOR = 0.1;

const AsteroidData = () => ({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    size: 0,
    rotation: 0,
});

export function AsteroidSystem(m) {
    const ctx = useContext(m, AsteroidSystem, () => ({
        asteroids: [],
        spawnTicks: ASTEROID_SPAWN_RATE[0],
    }));
}

export function initSpawnAsteroids(world) {
    for (let i = 0; i < ASTEROID_SPAWN_INIT_COUNT * world.level; ++i) {
        spawnAsteroids(world);
    }
}

export function clearAsteroids(world) {
    world.asteroids.length = 0;
}

export function getAsteroidList(world) {
    return world.asteroids;
}

export function hasAsteroids(world) {
    return world.asteroids.length > 0;
}

export function updateAsteroids(world, dt) {
    if (world.gamePause) {
        return;
    }

    world.spawnTicks -= dt;
    if (world.spawnTicks <= 0) {
        spawnAsteroids(world);
        world.spawnTicks = Random.range(ASTEROID_SPAWN_RATE[0], ASTEROID_SPAWN_RATE[1]);
    }
}

export function updateAsteroidMotion(world) {
    let asteroids = getAsteroidList(world);

    for (let asteroid of asteroids) {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        // Wrap around
        wrapAround(world,
            asteroid, asteroid.size * 2,
            asteroid.size * 2);
    }
}

export function updateAsteroidCollision(world) {
    for (let asteroid of world.asteroids) {
        if (withinRadius(asteroid, world.player, asteroid.size + PLAYER_RADIUS)) {
            explode(
                world,
                asteroid.x,
                asteroid.y,
                10,
                Random.choose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS)
            );
            destroyAsteroid(world, asteroid);
            killPlayer(world);
            break;
        }
    }
}

export function resetAsteroidSpawnTimer(world) {
    world.spawnTicks = 0;
}

export function spawnAsteroids(world) {
    if (world.asteroids.length > MAX_ASTEROID_COUNT) {
        return;
    }
    let spawnRange = Random.choose(getAsteroidSpawnRanges(world));
    let asteroid = createRandomAsteroid(spawnRange);
    world.asteroids.push(asteroid);
}

function createAsteroid(x, y, dx, dy, size) {
    let asteroid = AsteroidData();
    asteroid.x = x;
    asteroid.y = y;
    asteroid.dx = dx;
    asteroid.dy = dy;
    asteroid.size = size;
    asteroid.rotation = Math.atan2(dy, dx);
    return asteroid;
}

function createRandomAsteroid(spawnRange) {
    return createAsteroid(
        Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
        Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
        ASTEROID_RADIUS,
    );
}

export function getAsteroidSpawnRanges(world) {
    let canvasWidth = world.canvas.width;
    let canvasHeight = world.canvas.height;
    return [
        [
            -ASTEROID_RADIUS,
            -ASTEROID_RADIUS,
            ASTEROID_RADIUS * 2 + canvasWidth,
            ASTEROID_RADIUS,
        ],
        [-ASTEROID_RADIUS, 0, ASTEROID_RADIUS, canvasHeight],
        [
            -ASTEROID_RADIUS,
            canvasHeight,
            ASTEROID_RADIUS * 2 + canvasWidth,
            ASTEROID_RADIUS,
        ],
        [canvasWidth, 0, ASTEROID_RADIUS, canvasHeight],
    ];
}

function breakUpAsteroid(world, asteroid, dx = 0, dy = 0) {
    dx *= ASTEROID_BREAK_DAMP_FACTOR;
    dy *= ASTEROID_BREAK_DAMP_FACTOR;
    destroyAsteroid(world, asteroid);
    if (asteroid.size > SMALL_ASTEROID_RADIUS) {
        let children = [];
        for (let i = 0; i < 4; ++i) {
            children.push(createAsteroid(
                asteroid.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                asteroid.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                SMALL_ASTEROID_RADIUS));
        }
        world.asteroids.push(...children);
    }
}

function destroyAsteroid(world, asteroid) {
    world.asteroids.splice(world.asteroids.indexOf(asteroid), 1);
}

export function drawAsteroids(ctx, world) {
    for (let asteroid of world.asteroids) {
        drawAsteroid(ctx, asteroid);
        drawCollisionCircle(ctx, asteroid.x, asteroid.y, asteroid.size);
    }
}

function drawAsteroid(ctx, asteroid) {
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
}

export function drawAsteroidSpawnTimer(ctx, world) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
        Math.ceil(world.spawnTicks / 1000),
        world.canvas.width,
        world.canvas.height - 12);
}

export function explodeAsteroidOnBulletHit(world, asteroid, bullet) {
    explode(world, asteroid.x, asteroid.y, 10,
        Random.choose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS));
    breakUpAsteroid(
        world, asteroid,
        bullet.dx,
        bullet.dy);
}