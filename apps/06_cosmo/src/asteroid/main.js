import { EntityManager } from './lib/EntityManager.js';
import { EventManager } from './lib/EventManager.js';

import { Assets, loadAssets } from './assets.js';
import * as Starfield from './Starfield.js';

import { createAsteroidSpawner, drawAsteroids, onNextLevelAsteroid, updateAsteroids, updateAsteroidSpawner } from './Asteroid.js';
import { DEBUG, drawCollisionCircle, FLASH_TIME_STEP } from './util.js';
import { drawPlayer, onNextLevelPlayer, PLAYER_RADIUS, spawnPlayer, updatePlayer } from './Player.js';
import { drawParticles, onNextLevelParticle, updateParticles } from './Particle.js';
import { createPowerUpSpawner, drawPowerUps, onNextLevelPowerUp, PowerUp, updatePowerUps, updatePowerUpSpawner } from './PowerUp.js';
import { drawBullets, onNextLevelBullet, updateBullets } from './Bullet.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 */

export async function main() {
  /** @type {DisplayPort} */
  const display = document.querySelector('#display');
  const canvas = display.canvas;
  const ctx = canvas.getContext('2d');

  let core = {
    display
  };
  let scene = {};
  await load.call(scene);
  AsteroidGame.call(scene, core);
  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    const { deltaTime } = e.detail;
    update.call(scene, deltaTime);
    render.call(scene, ctx);
  });
}

const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';

async function load() {
  console.log('Loading...');
  await loadAssets();
  console.log('...loading complete!');
}

export function AsteroidGame(core) {
  this.core = core;
  this.ents = new EntityManager();
  this.events = new EventManager();

  this.level = 0;
  this.score = 0;
  this.highScore = Number(localStorage.getItem('highscore'));
  this.flashScore = 0;
  this.flashScoreDelta = 0;
  this.flashHighScore = 0;
  this.flashHighScoreDelta = 0;
  this.flashShootDelta = 0;
  this.dt = 0;

  let canvas = core.display.canvas;
  this.display = core.display;

  this.player = null;
  spawnPlayer(this);

  this.asteroids = [];
  this.asteroidSpawner = createAsteroidSpawner(this);

  this.powerUpSpawner = createPowerUpSpawner(this);

  this.starfield = Starfield.createStarfield(canvas.width, canvas.height);

  this.gamePause = true;
  this.showPlayer = true;
  this.gameStart = true;
  this.gameWait = true;
  this.hint = INSTRUCTION_HINT_TEXT;

  document.addEventListener('keydown', (e) => onKeyDown.call(this, e.key));
  document.addEventListener('keyup', (e) => onKeyUp.call(this, e.key));
}

/**
 * @this {AsteroidGame}
 * @param {number} dt The delta time spent on the previous frame.
 */
function update(dt) {
  if (this.gamePause) {
    // Update particles
    updateParticles(dt, this);
    return;
  }

  this.dt = dt;

  // Update players
  updatePlayer(dt, this);
  // Update bullets
  updateBullets(dt, this);
  // Update particles
  updateParticles(dt, this);
  // Update asteroids
  updateAsteroids(dt, this, this.asteroids);
  // Update power-up
  updatePowerUps(dt, this)
  // Update starfield
  Starfield.updateStarfield(this.starfield);
  // Update spawners
  updateAsteroidSpawner(dt, this, this.asteroidSpawner);
  updatePowerUpSpawner(dt, this, this.powerUpSpawner);

  if (!this.gamePause && this.asteroids.length <= 0) {
    this.gamePause = true;
    this.showPlayer = true;
    Assets.SoundStart.current.play();
    setTimeout(() => (this.gameWait = true), 1000);
  }

  this.ents.flush();
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 */
function render(ctx) {
  let canvas = ctx.canvas;

  // Draw background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw starfield
  Starfield.renderStarfield(ctx, this.starfield);

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
  // Draw particle
  drawParticles(ctx, this);

  // Draw player
  if (this.showPlayer) {
    drawPlayer(ctx, this);
  }
  drawCollisionCircle(ctx, this.player.x, this.player.y, PLAYER_RADIUS);
}

/**
 * @param {AsteroidGame} scene 
 */
function nextLevel(scene) {
  scene.level++;
  scene.gamePause = false;
  scene.showPlayer = true;

  onNextLevelPlayer(scene);
  onNextLevelBullet(scene);
  onNextLevelAsteroid(scene);
  onNextLevelPowerUp(scene);
  onNextLevelParticle(scene);

  if (!Assets.BackgroundMusic.current.isPlaying()) {
    Assets.BackgroundMusic.current.play({ loop: true });
  }
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
