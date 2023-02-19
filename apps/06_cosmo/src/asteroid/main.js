import { DisplayPort } from '@milque/display';
import { Assets, loadAssets } from './assets.js';

import { PlayerSystem } from './Player.js';
import { ParticleSystem } from './Particle.js';
import { PowerUpSystem } from './PowerUp.js';
import { BulletSystem } from './Bullet.js';

import { StarfieldSystem } from './Starfield.js';
import { createAnimationFrameLoop, useSystem } from './lib/M';
import { SystemManager } from './lib/system/SystemManager.js';
import { AsteroidGame, NextLevelEvent } from './AsteroidGame.js';
import { EventTopic } from './lib/system/topics/EventTopic.js';
import { PriorityEventTopic } from './lib/system/topics/PriorityEventTopic.js';
import { EntityManager } from './lib/EntityManager.js';
import { AsteroidSystem } from './Asteroid.js';

/** @typedef {{ deltaTime: number }} UpdateEventAttachment */
/** @type {EventTopic<UpdateEventAttachment>} */
export const UpdateEvent = new EventTopic();

/** @typedef {CanvasRenderingContext2D} DrawEventAttachment */
/** @type {PriorityEventTopic<DrawEventAttachment>} */
export const DrawEvent = new PriorityEventTopic();

export async function main() {
  const m = await init();
  requestAnimationFrame(createAnimationFrameLoop((e) => {
    UpdateEvent.dispatch(e.detail);
    UpdateEvent.flush();
    DrawEvent.dispatch(m.getState(DisplayPortProvider).ctx);
    DrawEvent.flush();
  }));
}

async function init() {
  console.log('Loading...');
  await loadAssets();
  console.log('...loading complete!');

  const systemManager = new SystemManager();
  systemManager
    .register(DisplayPortProvider)
    .register(EntityManagerProvider, undefined, (state) => state.reset())
    .register(AsteroidGame)
    .register(StarfieldSystem)
    .register(ParticleSystem)
    .register(PlayerSystem)
    .register(BulletSystem)
    .register(PowerUpSystem)
    .register(AsteroidSystem);
  return await systemManager.start();
}

/**
 * @param {AsteroidGame} scene 
 */
export function nextLevel(scene) {
  scene.level++;
  scene.gamePause = false;
  scene.showPlayer = true;

  NextLevelEvent.dispatchImmediately(scene);

  if (!Assets.BackgroundMusic.current.isPlaying()) {
    Assets.BackgroundMusic.current.play({ loop: true });
  }
}

export function DisplayPortProvider() {
  /** @type {DisplayPort} */
  const display = document.querySelector('#display');
  const canvas = display.canvas;
  const ctx = canvas.getContext('2d');
  return { display, canvas, ctx };
}

export function EntityManagerProvider() {
  let state = new EntityManager();
  UpdateEvent.on(() => state.flush());
  return state;
}

export function useUpdate(m, updateCallback) {
  m.before(() => {
    UpdateEvent.on(updateCallback);
    return () => {
      UpdateEvent.off(updateCallback);
    };
  });
}

export function useDraw(m, layerIndex, drawCallback) {
  m.before(() => {
    DrawEvent.on(layerIndex, drawCallback);
    return () => {
      DrawEvent.off(drawCallback);
    };
  });
}

export function useCanvas(m) {
  let displayPort = useSystem(m, DisplayPortProvider);
  return displayPort.canvas;
}
