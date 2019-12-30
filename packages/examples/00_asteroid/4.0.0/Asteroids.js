import * as Random from './util/Random.js';
import * as Utils from './util/Utils.js';
import * as Lib from './lib.js';

import * as Particles from './Particles.js';
import * as Player from './Player.js';
import * as Views from './Views.js';

const ASTEROID_SPAWN_RATE = [3000, 10000];
const MAX_ASTEROID_COUNT = 100;

export const SMALL_ASTEROID_RADIUS = 4;
export const ASTEROID_RADIUS = 8;
export const ASTEROID_SPEED = 1;
export const ASTEROID_SPAWN_RANGES = [
    [-ASTEROID_RADIUS, -ASTEROID_RADIUS, ASTEROID_RADIUS * 2 + Views.MAIN_VIEW.width, ASTEROID_RADIUS],
    [-ASTEROID_RADIUS, 0, ASTEROID_RADIUS, Views.MAIN_VIEW.height],
    [-ASTEROID_RADIUS, Views.MAIN_VIEW.height, ASTEROID_RADIUS * 2 + Views.MAIN_VIEW.width, ASTEROID_RADIUS],
    [Views.MAIN_VIEW.width, 0, ASTEROID_RADIUS, Views.MAIN_VIEW.height],
];
export const ASTEROID_EXPLODE_PARTICLE_COLORS = [ 'blue', 'blue', 'blue', 'dodgerblue', 'gray', 'darkgray', 'yellow' ];
export const ASTEROID_BREAK_DAMP_FACTOR = 0.1;

export function create(scene, x, y, dx, dy, size)
{
    return {
        scene,
        x, y,
        dx, dy,
        size,
        rotation: Math.atan2(dy, dx),
        breakUp(dx = 0, dy = 0)
        {
            this.destroy();
            if (this.size > SMALL_ASTEROID_RADIUS)
            {
                let children = [];
                children.push(create(
                    this.scene,
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS)
                );
                children.push(create(
                    this.scene,
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS)
                );
                children.push(create(
                    this.scene,
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS)
                );
                children.push(create(
                    this.scene,
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS)
                );
                this.scene.asteroids.push(...children);
            }
        },
        destroy()
        {
            this.scene.asteroids.splice(this.scene.asteroids.indexOf(this), 1);
        }
    };
}

export function update(dt, scene)
{
    for(let asteroid of scene.asteroids)
    {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        // Wrap around
        Lib.wrapAround(asteroid, asteroid.size * 2, asteroid.size * 2);
    }

    // Update asteroid collision
    for(let asteroid of scene.asteroids)
    {
        if (Utils.withinRadius(asteroid, scene.player, asteroid.size + Player.PLAYER_RADIUS))
        {
            Particles.explode(scene, asteroid.x, asteroid.y, 10, Random.randomChoose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS));
            asteroid.destroy();
            killPlayer(scene);
            break;
        }
    }
}

export function render(ctx, scene)
{
    for(let asteroid of scene.asteroids)
    {
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.fillStyle = 'slategray';
        ctx.fillRect(-asteroid.size, -asteroid.size, asteroid.size * 2, asteroid.size * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        Lib.drawCollisionCircle(ctx, asteroid.x, asteroid.y, asteroid.size);
    }
}

export function createSpawner(scene)
{
    return {
        scene,
        spawnTicks: ASTEROID_SPAWN_RATE[1],
        reset()
        {
            this.spawnTicks = ASTEROID_SPAWN_RATE[1];
        },
        spawn()
        {
            if (this.scene.asteroids.length > MAX_ASTEROID_COUNT) return;
            let spawnRange = Random.randomChoose(ASTEROID_SPAWN_RANGES);
            let asteroid = create(
                this.scene,
                // X range
                Random.randomRange(spawnRange[0], spawnRange[0] + spawnRange[2]),
                // Y range
                Random.randomRange(spawnRange[1], spawnRange[1] + spawnRange[3]),
                Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED),
                Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED),
                ASTEROID_RADIUS
            );
            this.scene.asteroids.push(asteroid);
        },
        update(dt)
        {
            if (!this.scene.gamePause)
            {
                this.spawnTicks -= dt;
                if (this.spawnTicks <= 0)
                {
                    this.spawn();
                    this.spawnTicks = Random.randomRange(...ASTEROID_SPAWN_RATE);
                }
            }
        }
    };
}

function killPlayer(scene)
{
    scene.gamePause = true;
    scene.showPlayer = false;
    Particles.explode(scene, scene.player.x, scene.player.y, 100, Random.randomChoose.bind(null, Player.PLAYER_EXPLODE_PARTICLE_COLORS));
    scene.sounds.dead.play();
    scene.sounds.boom.play();
    setTimeout(() => scene.gameStart = scene.gameWait = true, 1000);
}
