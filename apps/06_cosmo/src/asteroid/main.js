import { Assets, loadAssets } from './assets.js';

import { onNextLevelAsteroid } from './Asteroid.js';
import { DEBUG } from './util.js';
import { onNextLevelPlayer, PlayerSystem } from './Player.js';
import { onNextLevelParticle, ParticleSystem } from './Particle.js';
import { onNextLevelPowerUp, PowerUp } from './PowerUp.js';
import { onNextLevelBullet } from './Bullet.js';

import { StarfieldSystem } from './Starfield.js';
import { DisplayPortSystem } from './lib/DisplayPortSystem.js';
import { createAnimationFrameLoop, DrawEvent, DrawLayerManagerSystem, EntityManagerSystem, EventSourceManagerSystem, UpdateEvent, useDraw, useSystem, useUpdate } from './lib/M';
import { SystemManager } from './lib/system/SystemManager.js';
import { AsteroidGame } from './AsteroidGame.js';

/** @typedef {import('@milque/display').DisplayPort} DisplayPort */

export async function main() {
  const m = await init();
  requestAnimationFrame(createAnimationFrameLoop((e) => {
    UpdateEvent.send(e.detail);
    UpdateEvent.flush();
    DrawEvent.send(m.getState(DisplayPortSystem).ctx);
    DrawEvent.flush();
  }));
}

async function init() {

  console.log('Loading...');
  await loadAssets();
  console.log('...loading complete!');

  const systemManager = new SystemManager();
  await systemManager.start(
    DisplayPortSystem,
    EventSourceManagerSystem,
    DrawLayerManagerSystem,
    EntityManagerSystem,
    AsteroidGame,
    StarfieldSystem,
    ParticleSystem,
    PlayerSystem,
  );
  return systemManager;
}

export function nextLevel(scene) {
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
