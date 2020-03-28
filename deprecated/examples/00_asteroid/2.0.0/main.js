import * as Sound from './Sound.js';
import * as Input from './Input.js';
import * as Random from './Random.js';
import * as Canvas from './Canvas.js';
import GameLoop from './GameLoop.js';

Canvas.init();
Sound.init();
Input.init();

let mainScene = { start, update, render };
GameLoop.on('start', () => {
    mainScene.start()
});
GameLoop.on('update', (dt) => {
    mainScene.update(dt);
    mainScene.render(Canvas.getContext());
    Input.poll();
});

const PLAYER_RADIUS = 5;
const SMALL_ASTEROID_RADIUS = 4;
const ASTEROID_RADIUS = 8;
const ASTEROID_SPAWN_RANGES = [
    [-ASTEROID_RADIUS, -ASTEROID_RADIUS, ASTEROID_RADIUS * 2 + Canvas.getWidth(), ASTEROID_RADIUS],
    [-ASTEROID_RADIUS, 0, ASTEROID_RADIUS, Canvas.getHeight()],
    [-ASTEROID_RADIUS, Canvas.getHeight(), ASTEROID_RADIUS * 2 + Canvas.getWidth(), ASTEROID_RADIUS],
    [Canvas.getWidth(), 0, ASTEROID_RADIUS, Canvas.getHeight()],
];
const ASTEROID_SPAWN_RATE = [3000, 10000];
const ASTEROID_SPAWN_INIT_COUNT = 1;
const MAX_ASTEROID_COUNT = 100;
const ASTEROID_SPEED = 1;
const PLAYER_SHOOT_COOLDOWN = 10;
const PARTICLE_RADIUS = 4;
const PARTICLE_SPEED = 2;
const MAX_PARTICLE_AGE = 600;
const ASTEROID_BREAK_DAMP_FACTOR = 0.1;
const PLAYER_EXPLODE_PARTICLE_COLORS = [ 'red', 'red', 'red', 'yellow', 'orange' ];
const ASTEROID_EXPLODE_PARTICLE_COLORS = [ 'blue', 'blue', 'blue', 'dodgerblue', 'gray', 'darkgray', 'yellow' ];
const PLAYER_MOVE_PARTICLE_COLORS = [ 'gray', 'darkgray', 'lightgray' ];
const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';
const PLAYER_MOVE_PARTICLE_OFFSET_RANGE = [-2, 2];
const PLAYER_MOVE_PARTICLE_DAMP_FACTOR = 1.5;
const MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.1;
const MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.4;
const FLASH_TIME_STEP = 0.1;

const PLAYER_MOVE_SPEED = 0.02;
const PLAYER_ROT_SPEED = 0.008;
const PLAYER_ROT_FRICTION = 0.1;
const PLAYER_MOVE_FRICTION = 0.001;

const POWER_UP_RADIUS = 4;
const POWER_UP_EXPLODE_PARTICLE_COLORS = [ 'violet', 'white', 'violet' ];
const POWER_UP_AMOUNT = 30;
const POWER_UP_SPAWN_CHANCE = 0.7;

const BULLET_RADIUS = 2;
const BULLET_SPEED = 4;
const MAX_BULLET_AGE = 2000;
const MAX_BULLET_COUNT = 100;
const BULLET_COLOR = 'gold';

let SHOW_COLLISION = false;

const sounds = {
    start: Sound.createSound('../res/start.wav'),
    dead: Sound.createSound('../res/dead.wav'),
    pop: Sound.createSound('../res/boop.wav'),
    music: Sound.createSound('../res/music.wav', true),
    shoot: Sound.createSound('../res/click.wav'),
    boom: Sound.createSound('../res/boom.wav'),
};

const inputs = {
    up: Input.createInput(['ArrowUp', 'w']),
    down: Input.createInput(['ArrowDown', 's']),
    left: Input.createInput(['ArrowLeft', 'a']),
    right: Input.createInput(['ArrowRight', 'd']),
    fire: Input.createInput([' ']),
    debug: Input.createInput(['\\'], (value, prev) => { if (value) SHOW_COLLISION = !SHOW_COLLISION }),
    start: Input.createInput(['*'], (value, prev) => {
        if (mainScene.gameWait)
        {
            if (mainScene.gameStart)
            {
                sounds.music.play();
                mainScene.score = 0;
                mainScene.flashScore = true;
                mainScene.level = 0;
                mainScene.gameStart = false;
                mainScene.player.powerMode = 0;
                mainScene.powerUps.clear();
                mainScene.asteroidSpawner.reset();
                mainScene.powerUpSpawner.reset();
            }
            mainScene.gameWait = false;
            nextLevel(mainScene);
        }
    })
};

function BulletFactory(entity, x, y, dx, dy)
{
    Object.assign(entity, {
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx),
        age: 0
    });
}

function ParticleFactory(entity, x, y, dx, dy, color)
{
    if (typeof color === 'function') color = color.call(null);
    Object.assign(entity, {
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx),
        age: 0,
        color
    });
}

function PowerUpFactory(entity, x, y, dx, dy)
{
    Object.assign(entity, {
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx)
    });
}

function AsteroidFactory(entity, x, y, dx, dy, size)
{
    Object.assign(entity, {
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx),
        size,
        breakUp(dx = 0, dy = 0)
        {
            this.destroy();
            if (this.size > SMALL_ASTEROID_RADIUS)
            {
                this._entityClass.create(
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS
                );
                this._entityClass.create(
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS
                );
                this._entityClass.create(
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS
                );
                this._entityClass.create(
                    this.x + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    this.y + Random.randomRange(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                    Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                    SMALL_ASTEROID_RADIUS
                );
            }
        }
    });
}

function start()
{
    this.level = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highscore'));

    this.flashScoreDelta = 0;
    this.flashHighScoreDelta = 0;
    this.flashShootDelta = 0;

    this.player = createPlayer(this);
    this.asteroids = createEntityClass(AsteroidFactory);
    this.bullets = createEntityClass(BulletFactory);
    this.particles = createEntityClass(ParticleFactory);
    this.powerUps = createEntityClass(PowerUpFactory);
    
    this.asteroidSpawner = {
        scene: this,
        spawnTicks: ASTEROID_SPAWN_RATE[1],
        reset()
        {
            this.spawnTicks = ASTEROID_SPAWN_RATE[1];
        },
        spawn()
        {
            if (this.scene.asteroids.count() > MAX_ASTEROID_COUNT) return;
            let spawnRange = Random.randomChoose(ASTEROID_SPAWN_RANGES);
            this.scene.asteroids.create(
                // X range
                Random.randomRange(spawnRange[0], spawnRange[0] + spawnRange[2]),
                // Y range
                Random.randomRange(spawnRange[1], spawnRange[1] + spawnRange[3]),
                Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED),
                Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED),
                ASTEROID_RADIUS
            );
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

    this.powerUpSpawner = {
        scene: this,
        reset()
        {
            // Do nothing.
        },
        spawn()
        {
            let spawnRange = Random.randomChoose(ASTEROID_SPAWN_RANGES);
            this.scene.powerUps.create(
                // X range
                Random.randomRange(spawnRange[0], spawnRange[0] + spawnRange[2]),
                // Y range
                Random.randomRange(spawnRange[1], spawnRange[1] + spawnRange[3]),
                Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED),
                Random.randomRange(-ASTEROID_SPEED, ASTEROID_SPEED)
            );
        },
        update(dt)
        {
            // Do nothing.
        }
    };

    this.gamePause = true;
    this.showPlayer = true;
    this.gameStart = true;
    this.gameWait = true;
    this.hint = INSTRUCTION_HINT_TEXT;

    Sound.init();
}

function update(dt)
{
    if (this.gamePause)
    {
        // Update particle motion
        for(let particle of this.particles)
        {
            particle.age += dt;
            if (particle.age > MAX_PARTICLE_AGE)
            {
                particle.destroy();
            }
            else
            {
                particle.x += particle.dx;
                particle.y += particle.dy;
        
                // Wrap around
                wrapAround(particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
            }
        }

        return;
    }

    // Determine control
    const rotControl = inputs.right.value - inputs.left.value;
    const moveControl = inputs.down.value - inputs.up.value;
    const fireControl = inputs.fire.value;

    // Calculate velocity
    this.player.dx += moveControl * Math.cos(this.player.rotation) * PLAYER_MOVE_SPEED;
    this.player.dy += moveControl * Math.sin(this.player.rotation) * PLAYER_MOVE_SPEED;
    this.player.dx *= 1 - PLAYER_MOVE_FRICTION;
    this.player.dy *= 1 - PLAYER_MOVE_FRICTION;

    // Calculate angular velocity
    this.player.dr += rotControl * PLAYER_ROT_SPEED;
    this.player.dr *= 1 - PLAYER_ROT_FRICTION;

    // Calculate position
    this.player.x += this.player.dx;
    this.player.y += this.player.dy;
    this.player.rotation += this.player.dr;

    --this.player.cooldown;

    // Wrap around
    wrapAround(this.player, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);

    // Whether to fire a bullet
    if (fireControl)
    {
        this.player.shoot();
        this.flashShootDelta = 1;
    }

    // Whether to spawn thruster particles
    if (moveControl)
    {
        thrust(this, this.player.x, this.player.y, 
            -moveControl * Math.cos(this.player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
            -moveControl * Math.sin(this.player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR, 
            Random.randomChoose.bind(null, PLAYER_MOVE_PARTICLE_COLORS));
    }

    // Update bullet motion
    for(let bullet of this.bullets)
    {
        bullet.age += dt;
        if (bullet.age > MAX_BULLET_AGE)
        {
            bullet.destroy();
        }
        else
        {
            applyMotion(this, bullet, BULLET_RADIUS);
        }
    }

    // Update bullet collision
    for(let bullet of this.bullets)
    {
        for(let asteroid of this.asteroids)
        {
            if (withinRadius(bullet, asteroid, asteroid.size))
            {
                this.flashScore = 1;
                this.score++;
                if (this.score > this.highScore)
                {
                    this.flashHighScore = this.score - this.highScore;
                    this.highScore = this.score;
                    localStorage.setItem('highscore', this.highScore);
                }
                explode(this, asteroid.x, asteroid.y, 10, Random.randomChoose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS));
                sounds.pop.play();
                bullet.destroy();
                asteroid.breakUp(bullet.dx * ASTEROID_BREAK_DAMP_FACTOR, bullet.dy * ASTEROID_BREAK_DAMP_FACTOR);
                break;
            }
        }
    }

    // Update particle motion
    for(let particle of this.particles)
    {
        particle.age += dt;
        if (particle.age > MAX_PARTICLE_AGE)
        {
            particle.destroy();
        }
        else
        {
            applyMotion(this, particle, PARTICLE_RADIUS);
        }
    }

    // Update asteroid motion
    for(let asteroid of this.asteroids)
    {
        applyMotion(this, asteroid, asteroid.size);
    }

    // Update asteroid collision
    for(let asteroid of this.asteroids)
    {
        if (withinRadius(asteroid, this.player, asteroid.size + PLAYER_RADIUS))
        {
            explode(this, asteroid.x, asteroid.y, 10, Random.randomChoose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS));
            asteroid.destroy();
            killPlayer(this);
            break;
        }
    }

    // Update power-up motion
    for(let powerUp of this.powerUps)
    {
        applyMotion(this, powerUp, POWER_UP_RADIUS);
    }

    // Update power-up collision
    for(let powerUp of this.powerUps)
    {
        if (withinRadius(powerUp, this.player, POWER_UP_RADIUS + PLAYER_RADIUS))
        {
            explode(this, powerUp.x, powerUp.y, 10, Random.randomChoose.bind(null, POWER_UP_EXPLODE_PARTICLE_COLORS));
            powerUp.destroy();
            this.player.powerMode += POWER_UP_AMOUNT;
            break;
        }
    }

    // Update spawner
    this.asteroidSpawner.update(dt);
    this.powerUpSpawner.update(dt);

    if (!this.gamePause && this.asteroids.count() <= 0)
    {
        this.gamePause = true;
        this.showPlayer = true;
        sounds.start.play();
        setTimeout(() => this.gameWait = true, 1000);
    }
}

function render(ctx)
{
    // Draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, Canvas.getWidth(), Canvas.getHeight());

    // Draw hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.hint, Canvas.getWidth() / 2, Canvas.getHeight() / 2 - 32);

    // Draw score
    if (this.flashScore > 0)
    {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.flashScore + 0.2})`;
        this.flashScore -= FLASH_TIME_STEP;
    }
    else
    {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }
    ctx.font = '48px sans-serif';
    ctx.fillText('= ' + String(this.score).padStart(2, '0') + ' =', Canvas.getWidth() / 2, Canvas.getHeight() / 2);
    if (this.flashHighScore > 0)
    {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.flashHighScore + 0.2})`;
        this.flashHighScore -= FLASH_TIME_STEP;
    }
    else
    {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }
    ctx.font = '16px sans-serif';
    ctx.fillText(String(this.highScore).padStart(2, '0'), Canvas.getWidth() / 2, Canvas.getHeight() / 2 + 32);

    // Draw timer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.ceil(this.asteroidSpawner.spawnTicks / 1000), Canvas.getWidth(), Canvas.getHeight() - 12);

    // Draw asteroid
    for(let asteroid of this.asteroids)
    {
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.fillStyle = 'slategray';
        ctx.fillRect(-asteroid.size, -asteroid.size, asteroid.size * 2, asteroid.size * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        drawCollisionCircle(ctx, asteroid.x, asteroid.y, asteroid.size);
    }

    // Draw power-up
    for(let powerUp of this.powerUps)
    {
        ctx.translate(powerUp.x, powerUp.y);
        ctx.rotate(powerUp.rotation);
        ctx.beginPath();
        ctx.strokeStyle = 'violet';
        ctx.arc(0, 0, POWER_UP_RADIUS, 0, Math.PI * 2);
        ctx.moveTo(-POWER_UP_RADIUS / 2, 0);
        ctx.lineTo(POWER_UP_RADIUS / 2, 0);
        ctx.moveTo(0, -POWER_UP_RADIUS / 2);
        ctx.lineTo(0, POWER_UP_RADIUS / 2);
        ctx.stroke();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        drawCollisionCircle(ctx, powerUp.x, powerUp.y, POWER_UP_RADIUS);
    }

    // Draw bullet
    for(let bullet of this.bullets)
    {
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.rotation);
        ctx.fillStyle = BULLET_COLOR;
        ctx.fillRect(-BULLET_RADIUS, -BULLET_RADIUS, BULLET_RADIUS * 4, BULLET_RADIUS * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        drawCollisionCircle(ctx, bullet.x, bullet.y, BULLET_RADIUS);
    }

    // Draw particle
    for(let particle of this.particles)
    {
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        let size = PARTICLE_RADIUS * (1 - (particle.age / MAX_PARTICLE_AGE));
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Draw player
    if (this.showPlayer)
    {
        ctx.translate(this.player.x, this.player.y);
        ctx.rotate(this.player.rotation);
        ctx.fillStyle = 'white';
        let size = PLAYER_RADIUS;
        ctx.fillRect(-size, -size, size * 2, size * 2);
        let xOffset = -1;
        let yOffset = 0;
        let sizeOffset = 0;
        if (this.flashShootDelta > 0)
        {
            ctx.fillStyle = `rgb(${200 * this.flashShootDelta + 55 * Math.sin(performance.now() / (PLAYER_SHOOT_COOLDOWN * 2))}, 0, 0)`;
            this.flashShootDelta -= FLASH_TIME_STEP;
            sizeOffset = this.flashShootDelta * 2;
            xOffset = this.flashShootDelta;
        }
        else
        {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(-size - sizeOffset / 2 + xOffset, -(size / 4) - sizeOffset / 2 + yOffset, size + sizeOffset, size / 2 + sizeOffset);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawCollisionCircle(ctx, this.player.x, this.player.y, PLAYER_RADIUS);
}

function wrapAround(position, width, height)
{
    if (position.x < -width) position.x = Canvas.getWidth();
    if (position.y < -height) position.y = Canvas.getHeight();
    if (position.x > Canvas.getWidth() + width / 2) position.x = -width;
    if (position.y > Canvas.getHeight() + height / 2) position.y = -height;
}

function withinRadius(from, to, radius)
{
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius
}

function drawCollisionCircle(ctx, x, y, radius)
{
    if (!SHOW_COLLISION) return;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'lime';
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function nextLevel(scene)
{
    scene.bullets.clear();
    scene.asteroids.clear();
    scene.particles.clear();

    scene.player.x = Canvas.getWidth() / 2;
    scene.player.y = Canvas.getHeight() / 2;
    scene.player.dx = 0;
    scene.player.dy = 0;
    scene.level++;
    scene.gamePause = false;
    scene.showPlayer = true;

    for(let i = 0; i < ASTEROID_SPAWN_INIT_COUNT * scene.level; ++i)
    {
        scene.asteroidSpawner.spawn();
    }

    if (Random.random() > POWER_UP_SPAWN_CHANCE)
    {
        scene.powerUpSpawner.spawn();
    }
    
    if (sounds.music.isPaused()) sounds.music.play();
}

function createPlayer(scene)
{
    return {
        scene,
        x: Canvas.getWidth() / 2,
        y: Canvas.getHeight() / 2,
        rotation: 0,
        dx: 0,
        dy: 0,
        dr: 0,
        cooldown: 0,
        powerMode: 0,
        shoot()
        {
            if (this.scene.bullets.count() > MAX_BULLET_COUNT) return;
            if (this.cooldown > 0) return;
            if (this.powerMode > 0)
            {
                for(let i = -1; i <= 1; ++i)
                {
                    let rotation = this.rotation + i * Math.PI / 4;
                    this.scene.bullets.create(
                        this.x - Math.cos(rotation) * PLAYER_RADIUS,
                        this.y - Math.sin(rotation) * PLAYER_RADIUS,
                        -Math.cos(rotation) * BULLET_SPEED + this.dx,
                        -Math.sin(rotation) * BULLET_SPEED + this.dy
                    );
                }
                --this.powerMode;
            }
            else
            {
                let rotation = this.rotation;
                this.scene.bullets.create(
                    this.x - Math.cos(rotation) * PLAYER_RADIUS,
                    this.y - Math.sin(rotation) * PLAYER_RADIUS,
                    -Math.cos(rotation) * BULLET_SPEED + this.dx,
                    -Math.sin(rotation) * BULLET_SPEED + this.dy
                );
            }
            this.cooldown = PLAYER_SHOOT_COOLDOWN;
            sounds.shoot.play();
        }
    };
}

function killPlayer(scene)
{
    scene.gamePause = true;
    scene.showPlayer = false;
    explode(scene, scene.player.x, scene.player.y, 100, Random.randomChoose.bind(null, PLAYER_EXPLODE_PARTICLE_COLORS));
    sounds.dead.play();
    sounds.boom.play();
    setTimeout(() => scene.gameStart = scene.gameWait = true, 1000);
}

function thrust(scene, x, y, dx, dy, color)
{
    if (Random.random() > 0.3)
    {
        let particle = scene.particles.create(
            x + Random.randomRange(...PLAYER_MOVE_PARTICLE_OFFSET_RANGE),
            y + Random.randomRange(...PLAYER_MOVE_PARTICLE_OFFSET_RANGE),
            dx, dy,
            color
        );
        particle.age = Random.randomRange(MAX_PARTICLE_AGE * MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO, MAX_PARTICLE_AGE * MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO);
    }
}

function explode(scene, x, y, amount = 10, color)
{
    for(let i = 0; i < amount; ++i)
    {
        scene.particles.create(
            x, y,
            Random.randomRange(-1, 1) * PARTICLE_SPEED,
            Random.randomRange(-1, 1) * PARTICLE_SPEED,
            color
        );
    }
}

function applyMotion(scene, motionEntity, radius)
{
    motionEntity.x += motionEntity.dx;
    motionEntity.y += motionEntity.dy;
        
    // Wrap around
    wrapAround(motionEntity, radius * 2, radius * 2);
}

/***************************************************************/

function createEntityClass(entityFactory)
{
    return {
        factory: entityFactory,
        entities: [],
        create(...args)
        {
            let entity = {
                _entityClass: this,
                destroy() { this._entityClass.delete(this); }
            };
            this.factory.call(null, entity, ...args);
            this.entities.push(entity);
            return entity;
        },
        delete(entity)
        {
            this.entities.splice(this.entities.indexOf(entity), 1);
        },
        clear()
        {
            this.entities.length = 0;
        },
        count()
        {
            return this.entities.length;
        },
        [Symbol.iterator]()
        {
            const entityClass = this;
            return {
                _index: 0,
                next()
                {
                    if (this._index >= entityClass.entities.length) return { done: true };
                    return { value: entityClass.entities[this._index++] };
                }
            };
        }
    };
}

GameLoop.start();