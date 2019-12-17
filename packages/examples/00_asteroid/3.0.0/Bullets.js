import * as Random from './Random.js';
import * as Asteroids from './Asteroids.js';
import * as Particles from './Particles.js';
import * as Player from './Player.js';

export const BULLET_COLOR = 'gold';
export const BULLET_RADIUS = 2;
export const MAX_BULLET_AGE = 2000;
export const BULLET_SPEED = 4;
export const MAX_BULLET_COUNT = 100;

export function create(scene, x, y, dx, dy)
{
    return {
        scene,
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx),
        age: 0,
        destroy()
        {
            this.scene.bullets.splice(this.scene.bullets.indexOf(this), 1);
        }
    };
}

export function update(dt, scene)
{
    // Update bullet motion
    for(let bullet of scene.bullets)
    {
        bullet.age += dt;
        if (bullet.age > MAX_BULLET_AGE)
        {
            bullet.destroy();
        }
        else
        {
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
    
            // Wrap around
            wrapAround(bullet, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
        }
    }

    // Update bullet collision
    for(let bullet of scene.bullets)
    {
        for(let asteroid of scene.asteroids)
        {
            if (withinRadius(bullet, asteroid, asteroid.size))
            {
                scene.flashScore = 1;
                scene.score++;
                if (scene.score > scene.highScore)
                {
                    scene.flashHighScore = scene.score - scene.highScore;
                    scene.highScore = scene.score;
                    localStorage.setItem('highscore', scene.highScore);
                }
                Particles.explode(scene, asteroid.x, asteroid.y, 10, Random.randomChoose.bind(null, Asteroids.ASTEROID_EXPLODE_PARTICLE_COLORS));
                scene.sounds.pop.play();
                bullet.destroy();
                asteroid.breakUp(bullet.dx * Asteroids.ASTEROID_BREAK_DAMP_FACTOR, bullet.dy * Asteroids.ASTEROID_BREAK_DAMP_FACTOR);
                break;
            }
        }
    }
}

export function render(ctx, scene)
{
    // Draw bullet
    for(let bullet of scene.bullets)
    {
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.rotation);
        ctx.fillStyle = BULLET_COLOR;
        ctx.fillRect(-BULLET_RADIUS, -BULLET_RADIUS, BULLET_RADIUS * 4, BULLET_RADIUS * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        drawCollisionCircle(ctx, bullet.x, bullet.y, BULLET_RADIUS);
    }
}

export function shootFromPlayer(player)
{
    if (player.scene.bullets.length > MAX_BULLET_COUNT) return;
    if (player.cooldown > 0) return;
    if (player.powerMode > 0)
    {
        for(let i = -1; i <= 1; ++i)
        {
            let rotation = player.rotation + i * Math.PI / 4;
            let bullet = create(
                player.scene,
                player.x - Math.cos(rotation) * Player.PLAYER_RADIUS,
                player.y - Math.sin(rotation) * Player.PLAYER_RADIUS,
                -Math.cos(rotation) * BULLET_SPEED + player.dx,
                -Math.sin(rotation) * BULLET_SPEED + player.dy
            );
            player.scene.bullets.push(bullet);
        }
        --player.powerMode;
    }
    else
    {
        let bullet = create(
            player.scene,
            player.x - Math.cos(player.rotation) * Player.PLAYER_RADIUS,
            player.y - Math.sin(player.rotation) * Player.PLAYER_RADIUS,
            -Math.cos(player.rotation) * BULLET_SPEED + player.dx,
            -Math.sin(player.rotation) * BULLET_SPEED + player.dy
        );
        player.scene.bullets.push(bullet);
    }
    player.cooldown = Player.PLAYER_SHOOT_COOLDOWN;
    player.scene.sounds.shoot.play();
}