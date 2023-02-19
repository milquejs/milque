import { Assets } from './assets.js';

import { DEBUG } from './util.js';
import { createAsteroidSpawner, drawAsteroids, updateAsteroids, updateAsteroidSpawner } from './Asteroid.js';
import { drawCollisionCircle, FLASH_TIME_STEP } from './util.js';
import { PLAYER_RADIUS } from './Player.js';
import { createPowerUpSpawner, drawPowerUps, updatePowerUps, updatePowerUpSpawner, PowerUp } from './PowerUp.js';
import { drawBullets, updateBullets } from './Bullet.js';

import { DisplayPortSystem } from './lib/DisplayPortSystem.js';
import { EntityManagerSystem, useDraw, useSystem, useUpdate } from './lib/M';
import { nextLevel } from './main.js';

const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';

/** @param {import('./lib/M').M} m */
export function AsteroidGame(m) {
    const { display, canvas } = useSystem(m, DisplayPortSystem);
    const ents = useSystem(m, EntityManagerSystem);

    this.ents = ents;

    this.display = display;
    this.canvas = canvas;

    this.level = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highscore'));
    this.flashScore = 0;
    this.flashScoreDelta = 0;
    this.flashHighScore = 0;
    this.flashHighScoreDelta = 0;
    this.flashShootDelta = 0;
    this.dt = 0;

    this.player = null;

    this.asteroids = [];
    this.asteroidSpawner = createAsteroidSpawner(this);

    this.powerUpSpawner = createPowerUpSpawner(this);

    this.gamePause = true;
    this.showPlayer = true;
    this.gameStart = true;
    this.gameWait = true;
    this.hint = INSTRUCTION_HINT_TEXT;

    document.addEventListener('keydown', (e) => onKeyDown.call(this, e.key));
    document.addEventListener('keyup', (e) => onKeyUp.call(this, e.key));

    useUpdate(m, ({ deltaTime: dt }) => {
        if (this.gamePause) {
            return;
        }

        this.dt = dt;

        // Update bullets
        updateBullets(dt, this);
        // Update asteroids
        updateAsteroids(dt, this, this.asteroids);
        // Update power-up
        updatePowerUps(dt, this);
        // Update spawners
        updateAsteroidSpawner(dt, this, this.asteroidSpawner);
        updatePowerUpSpawner(dt, this, this.powerUpSpawner);

        if (!this.gamePause && this.asteroids.length <= 0) {
            this.gamePause = true;
            this.showPlayer = true;
            Assets.SoundStart.current.play();
            setTimeout(() => (this.gameWait = true), 1000);
        }
    });

    useDraw(m, 0, (ctx) => {
        const canvas = ctx.canvas;

        // Draw background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    useDraw(m, 2, (ctx) => {
        let canvas = ctx.canvas;

        // Draw hint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px sans-serif';
        ctx.fillText(this.hint, canvas.width / 2, canvas.height / 2 - 32);

        // Draw score
        if (this.flashScore > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashScore + 0.2})`;
            this.flashScore -= FLASH_TIME_STEP;
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }
        ctx.font = '48px sans-serif';
        ctx.fillText(
            '= ' + String(this.score).padStart(2, '0') + ' =',
            canvas.width / 2,
            canvas.height / 2
        );
        if (this.flashHighScore > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashHighScore + 0.2})`;
            this.flashHighScore -= FLASH_TIME_STEP;
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }
        ctx.font = '16px sans-serif';
        ctx.fillText(
            String(this.highScore).padStart(2, '0'),
            canvas.width / 2,
            canvas.height / 2 + 32
        );

        // Draw timer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(
            `${Math.ceil(this.asteroidSpawner.spawnTicks / 1000)}`,
            canvas.width,
            canvas.height - 12
        );

        // Draw asteroid
        drawAsteroids(ctx, this, this.asteroids);
        // Draw power-up
        drawPowerUps(ctx, this)
        // Draw bullet
        drawBullets(ctx, this);
    });

    useDraw(m, 11, (ctx) => {
        drawCollisionCircle(ctx, this.player.x, this.player.y, PLAYER_RADIUS);
    });

    return this;
}

/** @this {any} */
function onKeyDown(key) {
    if (this.gameWait) {
        if (this.gameStart) {
            Assets.BackgroundMusic.current.play();
            this.score = 0;
            this.flashScore = true;
            this.level = 0;
            this.gameStart = false;
            this.player.powerMode = 0;
            this.ents.clear(PowerUp);
            this.asteroidSpawner.reset();
            this.powerUpSpawner.reset();
        }
        this.gameWait = false;
        nextLevel(this);
    }

    switch (key) {
        case 'w':
        case 'ArrowUp':
            this.player.up = 1;
            break;
        case 's':
        case 'ArrowDown':
            this.player.down = 1;
            break;
        case 'a':
        case 'ArrowLeft':
            this.player.left = 1;
            break;
        case 'd':
        case 'ArrowRight':
            this.player.right = 1;
            break;
        case ' ':
            this.player.fire = 1;
            break;
        case '\\':
            break;
        default:
            console.log(key);
    }
}

function onKeyUp(key) {
    switch (key) {
        case 'w':
        case 'ArrowUp':
            this.player.up = 0;
            break;
        case 's':
        case 'ArrowDown':
            this.player.down = 0;
            break;
        case 'a':
        case 'ArrowLeft':
            this.player.left = 0;
            break;
        case 'd':
        case 'ArrowRight':
            this.player.right = 0;
            break;
        case ' ':
            this.player.fire = 0;
            break;
        case '\\':
            DEBUG.showCollision = !DEBUG.showCollision;
            break;
        default:
            console.log(key);
    }
}
