import * as Random from './Random.js';

import * as Starfield from './Starfield.js';
import * as Asteroids from './Asteroids.js';
import * as Bullets from './Bullets.js';
import * as Particles from './Particles.js';
import * as Player from './Player.js';
import * as PowerUps from './PowerUps.js';
import * as PlayerControls from './PlayerControls.js';

import * as Display from './Display.js';
import * as GameLoop from './GameLoop.js';
import * as Input from './Input.js';

let scene = { start, update, render };

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const CONTEXT = Input.createContext();
const ANY = CONTEXT.createInput('*');
const DEBUG = CONTEXT.createInput('\\');

const ASTEROID_SPAWN_INIT_COUNT = 1;
const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';
const FLASH_TIME_STEP = 0.1;
const POWER_UP_SPAWN_CHANCE = 0.7;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function start()
{
    this.sounds = {
        start: createSound('../res/start.wav'),
        dead: createSound('../res/dead.wav'),
        // TODO: Boop doesn't load correctly due to encoding?
        pop: createSound('../res/boop.wav'),
        music: createSound('../res/music.wav', true),
        shoot: createSound('../res/click.wav'),
        boom: createSound('../res/boom.wav'),
    };
    this.level = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highscore'));
    this.flashScoreDelta = 0;
    this.flashHighScoreDelta = 0;
    this.flashShootDelta = 0;

    this.player = Player.create(this);
    this.starfield = Starfield.create();

    this.asteroids = [];
    this.asteroidSpawner = Asteroids.createSpawner(this);

    this.bullets = [];
    this.particles = [];

    this.powerUps = [];
    this.powerUpSpawner = {
        scene: this,
        reset()
        {
            // Do nothing.
        },
        spawn()
        {
            let spawnRange = Random.randomChoose(Asteroids.ASTEROID_SPAWN_RANGES);
            let powerUp = PowerUps.create(
                this.scene,
                // X range
                Random.randomRange(spawnRange[0], spawnRange[0] + spawnRange[2]),
                // Y range
                Random.randomRange(spawnRange[1], spawnRange[1] + spawnRange[3]),
                Random.randomRange(-Asteroids.ASTEROID_SPEED, Asteroids.ASTEROID_SPEED),
                Random.randomRange(-Asteroids.ASTEROID_SPEED, Asteroids.ASTEROID_SPEED)
            );
            this.scene.powerUps.push(powerUp);
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

    CONTEXT.toggle(true);
    PlayerControls.CONTEXT.toggle(true);
}

function update(dt)
{
    Input.poll();
    
    SHOW_COLLISION = DEBUG.value;
    if (ANY.prev !== ANY.value && ANY.value)
    {
        if (this.gameWait)
        {
            if (this.gameStart)
            {
                this.sounds.music.play();
                this.score = 0;
                this.flashScore = true;
                this.level = 0;
                this.gameStart = false;
                this.player.powerMode = 0;
                this.powerUps.length = 0;
                this.asteroidSpawner.reset();
                this.powerUpSpawner.reset();
            }
            this.gameWait = false;
            nextLevel(this);
        }
    }

    this.render(Display.getContext());

    if (this.gamePause)
    {
        Particles.update(dt, this);
        return;
    }

    Player.update(dt, this);
    Bullets.update(dt, this);
    Particles.update(dt, this);
    Starfield.update(dt, this);
    Asteroids.update(dt, this);
    PowerUps.update(dt, this);

    // Update spawner
    this.asteroidSpawner.update(dt);
    this.powerUpSpawner.update(dt);

    if (!this.gamePause && this.asteroids.length <= 0)
    {
        this.gamePause = true;
        this.showPlayer = true;
        this.sounds.start.play();
        setTimeout(() => this.gameWait = true, 1000);
    }
}

function render(ctx)
{
    // Draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, Display.getWidth(), Display.getHeight());

    // Draw starfield
    Starfield.render(ctx, this);

    // Draw hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.hint, Display.getWidth() / 2, Display.getHeight() / 2 - 32);

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
    ctx.fillText('= ' + String(this.score).padStart(2, '0') + ' =', Display.getWidth() / 2, Display.getHeight() / 2);
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
    ctx.fillText(String(this.highScore).padStart(2, '0'), Display.getWidth() / 2, Display.getHeight() / 2 + 32);

    // Draw timer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.ceil(this.asteroidSpawner.spawnTicks / 1000), Display.getWidth(), Display.getHeight() - 12);

    Asteroids.render(ctx, this);
    PowerUps.render(ctx, this);
    Bullets.render(ctx, this);
    Particles.render(ctx, this);
    Player.render(ctx, this);
}

function nextLevel(scene)
{
    scene.bullets.length = 0;
    scene.asteroids.length = 0;
    scene.particles.length = 0;
    scene.player.x = Display.getWidth() / 2;
    scene.player.y = Display.getHeight() / 2;
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
    
    if (scene.sounds.music.isPaused()) scene.sounds.music.play();
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

GameLoop.start(scene);
