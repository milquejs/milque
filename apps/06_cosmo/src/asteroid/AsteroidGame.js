import { Topic } from '@milque/scene';
import { AssetRef } from '@milque/asset';

import { DEBUG } from './util.js';
import { createAsteroidSpawner } from './Asteroid.js';
import { drawCollisionCircle, FLASH_TIME_STEP } from './util.js';
import { PLAYER_RADIUS } from './Player.js';
import { createPowerUpSpawner, drawPowerUps, updatePowerUps, updatePowerUpSpawner, PowerUp } from './PowerUp.js';

import { usePreloadedAssets, useSystem } from './lib/M';
import { AssetManagerProvider, DisplayPortProvider, EntityManagerProvider, InputPortProvider, nextLevel, TopicManagerProvider, useDraw, useTopic, useUpdate } from './main.js';
import { Debug, MoveDown, MoveLeft, MoveRight, MoveUp, Shoot } from './Inputs.js';
import { loadSound } from './SoundLoader.js';

const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';

export const GameStartSound = new AssetRef('game.start', loadSound, undefined, 'raw://start.wav');
export const BackgroundMusic = new AssetRef('background.music', loadSound, undefined, 'raw://music.wav');

/** @type {Topic<number>} */
export const NextLevelEvent = new Topic('game.nextlevel');

export function useNextLevel(m, nextLevelCallback) {
    useTopic(m, NextLevelEvent, 0, nextLevelCallback);
}

/** @param {import('./lib/M').M} m */
export function AsteroidGame(m) {
    const { display, canvas } = useSystem(m, DisplayPortProvider);
    const ents = useSystem(m, EntityManagerProvider);
    const assets = useSystem(m, AssetManagerProvider);
    const topics = useSystem(m, TopicManagerProvider);
    const { ctx: ab } = useSystem(m, InputPortProvider);
    usePreloadedAssets(m, [
        GameStartSound,
        BackgroundMusic
    ]);

    this.ents = ents;
    this.assets = assets;
    this.topics = topics;

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

    useUpdate(m, ({ deltaTime: dt }) => {
        if (this.gamePause) {
            return;
        }

        this.dt = dt;

        // Update power-up
        updatePowerUps(dt, this);
        updatePowerUpSpawner(dt, this, this.powerUpSpawner);

        if (!this.gamePause && this.asteroids.length <= 0) {
            this.gamePause = true;
            this.showPlayer = true;
            GameStartSound.current.play();
            setTimeout(() => (this.gameWait = true), 1000);
        }
    });

    useUpdate(m, () => {
        if (ab.isAnyButtonPressed()) {
            if (this.gameWait) {
                if (this.gameStart) {
                    BackgroundMusic.current.play();
                    this.score = 0;
                    this.flashScore = 1;
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
        }

        this.player.up = MoveUp.value;
        this.player.down = MoveDown.value;
        this.player.left = MoveLeft.value;
        this.player.right = MoveRight.value;
        this.player.fire = Shoot.value;
        if (Debug.released) {
            DEBUG.showCollision = !DEBUG.showCollision;
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

        // Draw power-up
        drawPowerUps(ctx, this);
    });

    useDraw(m, 11, (ctx) => {
        drawCollisionCircle(ctx, this.player.x, this.player.y, PLAYER_RADIUS);
    });

    return this;
}
