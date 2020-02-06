import * as Random from './util/Random.js';
import * as GameLoop from './util/GameLoop.js';
import * as Utils from './util/Utils.js';
import * as Audio from './util/Audio.js';
import * as Display from './util/Display.js';
import * as Input from './util/Input.js';
import * as Lib from './lib.js';

import * as Starfield from './Starfield.js';
import * as Asteroids from './Asteroids.js';
import * as Bullets from './Bullets.js';
import * as Particles from './Particles.js';
import * as Player from './Player.js';
import * as PowerUps from './PowerUps.js';
import * as FlashAnimation from './FlashAnimation.js';
import * as Views from './Views.js';
import * as MainControls from './MainControls.js';

let scene = { start, update, render };

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const ASTEROID_SPAWN_INIT_COUNT = 1;
const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';
const POWER_UP_SPAWN_CHANCE = 0.7;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function start()
{
    this.sounds = {
        start: Audio.createSound('../res/start.wav'),
        dead: Audio.createSound('../res/dead.wav'),
        // TODO: Boop doesn't load correctly due to encoding?
        pop: Audio.createSound('../res/boop.wav'),
        music: Audio.createSound('../res/music.wav', true),
        shoot: Audio.createSound('../res/click.wav'),
        boom: Audio.createSound('../res/boom.wav'),
    };
    this.level = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highscore'));

    this.scoreFlash = FlashAnimation.create();
    this.highScoreFlash = FlashAnimation.create();

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

    MainControls.CONTEXT.enable();
}

function update(dt)
{
    Input.poll();

    if (MainControls.DEBUG.value)
    {
        Lib.toggleShowCollision();
    }
    
    if (MainControls.ANY.value)
    {
        if (this.gameWait)
        {
            if (this.gameStart)
            {
                this.sounds.music.play();
                this.score = 0;
                FlashAnimation.play(this.scoreFlash);
                this.level = 0;
                this.gameStart = false;
                this.player.powerMode = 0;
                this.powerUps.length = 0;
                this.asteroidSpawner.reset();
                this.powerUpSpawner.reset();
            }

            MainControls.CONTEXT.disable();
            this.gameWait = false;
            nextLevel(this);
        }
    }

    this.render(Views.MAIN_VIEW);

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
        setTimeout(() => Lib.waitGame(this), 1000);
    }
}

function render(view)
{
    let ctx = view.context;

    // Draw background
    Utils.clearScreen(ctx, view.width, view.height);

    // Draw starfield
    Starfield.render(ctx, this);

    // Draw hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.hint, view.width / 2, view.height / 2 - 32);

    // Draw score
    FlashAnimation.update(this.scoreFlash);
    let flashValue = FlashAnimation.getFlashValue(this.scoreFlash);
    if (flashValue > 0)
    {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashValue + 0.2})`;
    }
    else
    {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }
    ctx.font = '48px sans-serif';
    ctx.fillText('= ' + String(this.score).padStart(2, '0') + ' =', view.width / 2, view.height / 2);
    FlashAnimation.update(this.highScoreFlash);
    flashValue = FlashAnimation.getFlashValue(this.highScoreFlash);
    if (flashValue > 0)
    {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashValue + 0.2})`;
    }
    else
    {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }
    ctx.font = '16px sans-serif';
    ctx.fillText(String(this.highScore).padStart(2, '0'), view.width / 2, view.height / 2 + 32);

    // Draw timer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.ceil(this.asteroidSpawner.spawnTicks / 1000), view.width, view.height - 12);

    Asteroids.render(ctx, this);
    PowerUps.render(ctx, this);
    Bullets.render(ctx, this);
    Particles.render(ctx, this);
    Player.render(ctx, this);

    Display.drawBufferToScreen(ctx);
}

function nextLevel(scene)
{
    scene.bullets.length = 0;
    scene.asteroids.length = 0;
    scene.particles.length = 0;
    scene.player.x = Views.MAIN_VIEW.width / 2;
    scene.player.y = Views.MAIN_VIEW.height / 2;
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
