import '@milque/display';
import '@milque/asset';
import { Random } from '@milque/random';

import * as Starfield from './Starfield.js';
import * as Inputs from './Inputs.js';
import { ASSETS as Assets } from './Assets.js';
import { AssetManager } from '@milque/asset';

import { AsteroidSystem, getAsteroidList, resetAsteroidSpawnTimer, drawAsteroids, drawAsteroidSpawnTimer, updateAsteroidCollision, updateAsteroidMotion, updateAsteroids, hasAsteroids, clearAsteroids, initSpawnAsteroids, getAsteroidSpawnRanges, explodeAsteroidOnBulletHit } from './Asteroids.js';
import { createParticle, explode, PLAYER_RADIUS } from './Util.js';

document.title = 'Starfield';

/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const { display, assets, inputs } = game;
  const canvas = display.canvas;
  const ctx = canvas.getContext('2d');
  const mainScene = { load, start, update, render, canvas };

  const POWER_UP_SPEED = 1;
  const BULLET_RADIUS = 2;
  const BULLET_SPEED = 4;
  const MAX_BULLET_AGE = 2000;
  const MAX_BULLET_COUNT = 100;
  const PLAYER_SHOOT_COOLDOWN = 10;
  const PARTICLE_RADIUS = 4;
  const MAX_PARTICLE_AGE = 600;
  const PLAYER_MOVE_PARTICLE_COLORS = ['gray', 'darkgray', 'lightgray'];
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

  const BULLET_COLOR = 'gold';

  const POWER_UP_SPAWN_RATE = [10000, 30000];
  const POWER_UP_RADIUS = 4;
  const POWER_UP_EXPLODE_PARTICLE_COLORS = ['white', 'violet', 'violet'];
  const POWER_UP_AMOUNT = 30;
  const POWER_UP_SPAWN_CHANCE = 0.7;

  let SHOW_COLLISION = false;

  await mainScene.load();
  mainScene.start();
  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    let dt = e.detail.deltaTime;
    mainScene.update(dt);
    mainScene.render(ctx);
  });

  async function load() {
    console.log('Loading...');
    inputs.bindBindings(Object.values(Inputs));
    await AssetManager.loadAssetRefs(Object.values(Assets));
    console.log('...loading complete!');
  }

  function start() {
    this.level = 0;
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highscore'));
    this.flashScoreDelta = 0;
    this.flashHighScoreDelta = 0;
    this.flashShootDelta = 0;

    this.player = {
      scene: this,
      x: canvas.width / 2,
      y: canvas.height / 2,
      rotation: 0,
      dx: 0,
      dy: 0,
      dr: 0,
      get left() {
        return Inputs.RotateLeft.value;
      },
      get right() {
        return Inputs.RotateRight.value;
      },
      get up() {
        return Inputs.Forward.value;
      },
      get down() {
        return Inputs.Backward.value;
      },
      get fire() {
        return Inputs.Fire.value;
      },
      cooldown: 0,
      powerMode: 0,
      shoot() {
        if (this.scene.bullets.length > MAX_BULLET_COUNT) return;
        if (this.cooldown > 0) return;
        if (this.powerMode > 0) {
          for (let i = -1; i <= 1; ++i) {
            let rotation = this.rotation + (i * Math.PI) / 4;
            let bullet = createBullet(
              this.scene,
              this.x - Math.cos(rotation) * PLAYER_RADIUS,
              this.y - Math.sin(rotation) * PLAYER_RADIUS,
              -Math.cos(rotation) * BULLET_SPEED + this.dx,
              -Math.sin(rotation) * BULLET_SPEED + this.dy
            );
            this.scene.bullets.push(bullet);
          }
          --this.powerMode;
        } else {
          let bullet = createBullet(
            this.scene,
            this.x - Math.cos(this.rotation) * PLAYER_RADIUS,
            this.y - Math.sin(this.rotation) * PLAYER_RADIUS,
            -Math.cos(this.rotation) * BULLET_SPEED + this.dx,
            -Math.sin(this.rotation) * BULLET_SPEED + this.dy
          );
          this.scene.bullets.push(bullet);
        }
        this.cooldown = PLAYER_SHOOT_COOLDOWN;
        Assets.SoundShoot.current.play();
      },
    };

    AsteroidSystem(this);

    this.bullets = [];
    this.particles = [];

    this.powerUps = [];
    this.powerUpSpawner = {
      scene: this,
      reset() {
        // Do nothing.
      },
      spawn() {
        let spawnRange = Random.choose(getAsteroidSpawnRanges(this.scene));
        let powerUp = createPowerUp(
          this.scene,
          // X range
          Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
          // Y range
          Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
          Random.range(-POWER_UP_SPEED, POWER_UP_SPEED),
          Random.range(-POWER_UP_SPEED, POWER_UP_SPEED)
        );
        this.scene.powerUps.push(powerUp);
      },
      update(dt) {
        // Do nothing.
      },
    };

    this.starfield = Starfield.createStarfield(canvas.width, canvas.height);

    this.gamePause = true;
    this.showPlayer = true;
    this.gameStart = true;
    this.gameWait = true;
    this.hint = INSTRUCTION_HINT_TEXT;
  }

  /**
   * @this {any}
   * @param {number} dt The delta time spent on the previous frame.
   */
  function update(dt) {
    if (Inputs.Debug.pressed) {
      SHOW_COLLISION = !SHOW_COLLISION;
    }
    if (this.gameWait && inputs.isAnyButtonPressed()) {
      if (this.gameStart) {
        Assets.BackgroundMusic.current.play();
        this.score = 0;
        this.flashScore = true;
        this.level = 0;
        this.gameStart = false;
        this.player.powerMode = 0;
        this.powerUps.length = 0;
        resetAsteroidSpawnTimer(this);
        this.powerUpSpawner.reset();
      }
      this.gameWait = false;
      nextLevel(this);
    }
    if (this.gamePause) {
      // Update particle motion
      for (let particle of this.particles) {
        particle.age += dt;
        if (particle.age > MAX_PARTICLE_AGE) {
          particle.destroy();
        } else {
          particle.x += particle.dx;
          particle.y += particle.dy;

          // Wrap around
          wrapAround(particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        }
      }

      return;
    }

    // Determine control
    const rotControl = this.player.right - this.player.left;
    const moveControl = this.player.down - this.player.up;
    const fireControl = this.player.fire;

    // Calculate velocity
    this.player.dx +=
      moveControl * Math.cos(this.player.rotation) * PLAYER_MOVE_SPEED;
    this.player.dy +=
      moveControl * Math.sin(this.player.rotation) * PLAYER_MOVE_SPEED;
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
    if (fireControl) {
      this.player.shoot();
      this.flashShootDelta = 1;
    }

    // Whether to spawn thruster particles
    if (moveControl) {
      thrust(
        this,
        this.player.x,
        this.player.y,
        -moveControl *
        Math.cos(this.player.rotation) *
        PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
        -moveControl *
        Math.sin(this.player.rotation) *
        PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
        Random.choose.bind(null, PLAYER_MOVE_PARTICLE_COLORS)
      );
    }

    // Update bullet motion
    for (let bullet of this.bullets) {
      bullet.age += dt;
      if (bullet.age > MAX_BULLET_AGE) {
        bullet.destroy();
      } else {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Wrap around
        wrapAround(bullet, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
      }
    }

    // Update bullet collision
    let asteroids = getAsteroidList(this);
    for (let bullet of this.bullets) {
      for (let asteroid of asteroids) {
        if (withinRadius(bullet, asteroid, asteroid.size)) {
          this.flashScore = 1;
          this.score++;
          if (this.score > this.highScore) {
            this.flashHighScore = this.score - this.highScore;
            this.highScore = this.score;
            localStorage.setItem('highscore', this.highScore);
          }
          Assets.SoundPop.current.play();
          bullet.destroy();
          explodeAsteroidOnBulletHit(this, asteroid, bullet);
          break;
        }
      }
    }

    // Update particle motion
    for (let particle of this.particles) {
      particle.age += dt;
      if (particle.age > MAX_PARTICLE_AGE) {
        particle.destroy();
      } else {
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Wrap around
        wrapAround(particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
      }
    }

    // Update asteroid motion
    updateAsteroidMotion(this);

    // Update asteroid collision
    updateAsteroidCollision(this);

    // Update power-up motion
    for (let powerUp of this.powerUps) {
      powerUp.x += powerUp.dx;
      powerUp.y += powerUp.dy;

      // Wrap around
      wrapAround(powerUp, POWER_UP_RADIUS * 2, POWER_UP_RADIUS * 2);
    }

    // Update power-up collision
    for (let powerUp of this.powerUps) {
      if (withinRadius(powerUp, this.player, POWER_UP_RADIUS + PLAYER_RADIUS)) {
        explode(
          this,
          powerUp.x,
          powerUp.y,
          10,
          Random.choose.bind(null, POWER_UP_EXPLODE_PARTICLE_COLORS)
        );
        powerUp.destroy();
        this.player.powerMode += POWER_UP_AMOUNT;
        break;
      }
    }

    // Update starfield
    Starfield.updateStarfield(this.starfield);

    // Update spawner
    updateAsteroids(this, dt);
    this.powerUpSpawner.update(dt);

    if (!this.gamePause && !hasAsteroids(this)) {
      this.gamePause = true;
      this.showPlayer = true;
      Assets.SoundStart.current.play();
      setTimeout(() => (this.gameWait = true), 1000);
    }
  }

  function drawPowerUp(ctx, powerUp) {
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
  }

  function drawBullet(ctx, bullet) {
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(bullet.rotation);
    ctx.fillStyle = BULLET_COLOR;
    ctx.fillRect(
      -BULLET_RADIUS,
      -BULLET_RADIUS,
      BULLET_RADIUS * 4,
      BULLET_RADIUS * 2
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function drawParticle(ctx, particle) {
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    let size = PARTICLE_RADIUS * (1 - particle.age / MAX_PARTICLE_AGE);
    ctx.fillRect(-size, -size, size * 2, size * 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function render(ctx) {
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
    drawAsteroidSpawnTimer(ctx, this);

    // Draw asteroid
    drawAsteroids(ctx, this);

    // Draw power-up
    for (let powerUp of this.powerUps) {
      drawPowerUp(ctx, powerUp);
      drawCollisionCircle(ctx, powerUp.x, powerUp.y, POWER_UP_RADIUS);
    }

    // Draw bullet
    for (let bullet of this.bullets) {
      drawBullet(ctx, bullet);
      drawCollisionCircle(ctx, bullet.x, bullet.y, BULLET_RADIUS);
    }

    // Draw particle
    for (let particle of this.particles) {
      drawParticle(ctx, particle);
    }

    // Draw player
    if (this.showPlayer) {
      ctx.translate(this.player.x, this.player.y);
      ctx.rotate(this.player.rotation);
      ctx.fillStyle = 'white';
      let size = PLAYER_RADIUS;
      ctx.fillRect(-size, -size, size * 2, size * 2);
      let xOffset = -1;
      let yOffset = 0;
      let sizeOffset = 0;
      if (this.flashShootDelta > 0) {
        ctx.fillStyle = `rgb(${200 * this.flashShootDelta +
          55 * Math.sin(performance.now() / (PLAYER_SHOOT_COOLDOWN * 2))
          }, 0, 0)`;
        this.flashShootDelta -= FLASH_TIME_STEP;
        sizeOffset = this.flashShootDelta * 2;
        xOffset = this.flashShootDelta;
      } else {
        ctx.fillStyle = 'black';
      }
      ctx.fillRect(
        -size - sizeOffset / 2 + xOffset,
        -(size / 4) - sizeOffset / 2 + yOffset,
        size + sizeOffset,
        size / 2 + sizeOffset
      );
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawCollisionCircle(ctx, this.player.x, this.player.y, PLAYER_RADIUS);
  }

  function wrapAround(position, width, height) {
    if (position.x < -width) position.x = canvas.width;
    if (position.y < -height) position.y = canvas.height;
    if (position.x > canvas.width + width / 2) position.x = -width;
    if (position.y > canvas.height + height / 2) position.y = -height;
  }

  function withinRadius(from, to, radius) {
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius;
  }

  function drawCollisionCircle(ctx, x, y, radius) {
    if (!SHOW_COLLISION) return;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'lime';
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function createPowerUp(scene, x, y, dx, dy) {
    return {
      scene,
      x,
      y,
      dx,
      dy,
      rotation: Math.atan2(dy, dx),
      destroy() {
        this.scene.powerUps.splice(this.scene.powerUps.indexOf(this), 1);
      },
    };
  }

  function createBullet(scene, x, y, dx, dy) {
    return {
      scene,
      x,
      y,
      dx,
      dy,
      rotation: Math.atan2(dy, dx),
      age: 0,
      destroy() {
        this.scene.bullets.splice(this.scene.bullets.indexOf(this), 1);
      },
    };
  }

  function nextLevel(scene) {
    scene.bullets.length = 0;
    clearAsteroids(scene);
    scene.particles.length = 0;
    scene.player.x = canvas.width / 2;
    scene.player.y = canvas.height / 2;
    scene.player.dx = 0;
    scene.player.dy = 0;
    scene.level++;
    scene.gamePause = false;
    scene.showPlayer = true;

    initSpawnAsteroids(scene);

    if (Random.next() > POWER_UP_SPAWN_CHANCE) {
      scene.powerUpSpawner.spawn();
    }

    let music = Assets.BackgroundMusic.current;
    if (!music.isPlaying()) {
      music.play({ loop: true });
    }
  }

  function thrust(scene, x, y, dx, dy, color) {
    if (Random.next() > 0.3) {
      let particle = createParticle(
        scene,
        x + Random.range(PLAYER_MOVE_PARTICLE_OFFSET_RANGE[0], PLAYER_MOVE_PARTICLE_OFFSET_RANGE[1]),
        y + Random.range(PLAYER_MOVE_PARTICLE_OFFSET_RANGE[0], PLAYER_MOVE_PARTICLE_OFFSET_RANGE[1]),
        dx,
        dy,
        color
      );
      particle.age = Random.range(
        MAX_PARTICLE_AGE * MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO,
        MAX_PARTICLE_AGE * MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO
      );
      scene.particles.push(particle);
    }
  }
}
