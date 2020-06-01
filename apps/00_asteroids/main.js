import * as AssetLoader from './lib/AssetLoader.js';
import * as Audio from './lib/Audio.js';
import * as Game from './lib/Game.js';
import * as Random from './lib/Random.js';

import * as FlashAnimation from './game/FlashAnimation.js';

import * as Starfield from './game/Starfield.js';
import * as Player from './game/Player.js';

/*
import * as Asteroids from './game/Asteroids.js';
import * as Bullets from './game/Bullets.js';
import * as Particles from './game/Particles.js';
import * as PowerUps from './game/PowerUps.js';
import * as MainControls from './game/MainControls.js';
*/

const ASSET_PARENT_PATH = '../../res';

async function load()
{
    AssetLoader.defineAssetLoader('audio', Audio.loadAudio);
    
    this.assets = AssetLoader.loadAssetMap({
        start: 'audio:space/start.wav',
        dead: 'audio:space/dead.wav',
        boop: { src: 'audio:space/boop.wav', loop: true },
        music: 'audio:space/music.wav',
        click: 'audio:space/click.wav',
        boom: 'audio:space/boom.wav',
    }, ASSET_PARENT_PATH);
}

const ASTEROID_SPAWN_INIT_COUNT = 1;
const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';
const POWER_UP_SPAWN_CHANCE = 0.7;

function start()
{
    this.level = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highscore'));

    this.scoreFlash = FlashAnimation.createFlashAnimation();
    this.highScoreFlash = FlashAnimation.createFlashAnimation();

    this.player = Player.createPlayer(this);
    this.starfield = Starfield.createStarfield(this.display.width, this.display.height);
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
    this.powerUps = [];

    this.asteroidSpawner = null; // Asteroids.createSpawner(this);
    this.powerUpSpawner = {
        scene: this,
        reset()
        {
            // Do nothing.
        },
        spawn()
        {
            /*
            let spawnRange = Random.choose(Asteroids.ASTEROID_SPAWN_RANGES);
            let powerUp = PowerUps.create(
                this.scene,
                // X range
                Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
                // Y range
                Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
                Random.range(-Asteroids.ASTEROID_SPEED, Asteroids.ASTEROID_SPEED),
                Random.range(-Asteroids.ASTEROID_SPEED, Asteroids.ASTEROID_SPEED)
            );
            this.scene.powerUps.push(powerUp);
            */
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
    
    // MainControls.CONTEXT.enable();
}

function update(dt)
{
    /*
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
    */

    /*
    if (this.gamePause)
    {
        Particles.update(dt, this);
        return;
    }

    Player.update(dt, this);
    Bullets.update(dt, this);
    Particles.update(dt, this);
    Asteroids.update(dt, this);
    PowerUps.update(dt, this);

    // Update spawner
    this.asteroidSpawner.update(dt);
    this.powerUpSpawner.update(dt);
    */
    
    // Player.updatePlayer(this, this.player, this.display.width, this.display.height);
    Starfield.updateStarfield(this.starfield);

    if (!this.gamePause && this.asteroids.length <= 0)
    {
        this.gamePause = true;
        this.showPlayer = true;
        this.assets.start.play();
        setTimeout(() => {
            this.gamePause = true;
            this.gameWait = true;
        }, 1000);
    }
}

function render(ctx)
{
    const { width: displayWidth, height: displayHeight } = this.display;

    // Clear buffer
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Draw starfield
    Starfield.renderStarfield(ctx, this.starfield);

    // Draw hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.hint, displayWidth / 2, displayHeight / 2 - 32);

    // Draw score
    FlashAnimation.updateFlashAnimation(this.scoreFlash);
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
    ctx.fillText('= ' + String(this.score).padStart(2, '0') + ' =', displayWidth / 2, displayHeight / 2);
    FlashAnimation.updateFlashAnimation(this.highScoreFlash);
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
    ctx.fillText(String(this.highScore).padStart(2, '0'), displayWidth / 2, displayHeight / 2 + 32);

    // Draw timer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    // ctx.fillText(Math.ceil(this.asteroidSpawner.spawnTicks / 1000), displayWidth, displayHeight - 12);

    /*
    Asteroids.render(ctx, this);
    PowerUps.render(ctx, this);
    Bullets.render(ctx, this);
    Particles.render(ctx, this);
    Player.render(ctx, this);
    */
}

function nextLevel(game)
{
    game.bullets.length = 0;
    game.asteroids.length = 0;
    game.particles.length = 0;
    game.player.x = game.display.width / 2;
    game.player.y = game.display.height / 2;
    game.player.dx = 0;
    game.player.dy = 0;
    game.level++;
    game.gamePause = false;
    game.showPlayer = true;

    for(let i = 0; i < ASTEROID_SPAWN_INIT_COUNT * game.level; ++i)
    {
        game.asteroidSpawner.spawn();
    }

    if (Random.next() > POWER_UP_SPAWN_CHANCE)
    {
        game.powerUpSpawner.spawn();
    }
    
    if (!game.assets.music.playing) game.assets.music.play();
}

Game.start({ load, start, update, render });
