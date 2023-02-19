import { DisplayPort } from '@milque/display';
import { InputPort } from '@milque/input';
import { AssetManager, cacheAssetPackAsRaw } from '@milque/asset';
import { EntityManager, EventTopic, PriorityEventTopic } from '@milque/scene';

import * as Inputs from './Inputs.js';

import { PlayerSystem } from './Player.js';
import { ParticleSystem } from './Particle.js';
import { PowerUpSystem } from './PowerUp.js';
import { BulletSystem } from './Bullet.js';

import { StarfieldSystem } from './Starfield.js';
import { createAnimationFrameLoop, useSystem } from './lib/M';
import { SystemManager } from './lib/system/SystemManager.js';
import { AsteroidGame, BackgroundMusic, NextLevelEvent } from './AsteroidGame.js';
import { AsteroidSystem } from './Asteroid.js';


/** @typedef {{ deltaTime: number, currentTime: number }} UpdateEventAttachment */
/** @type {EventTopic<UpdateEventAttachment>} */
export const EarlyUpdateEvent = new EventTopic();
/** @type {EventTopic<UpdateEventAttachment>} */
export const UpdateEvent = new EventTopic();
/** @type {EventTopic<UpdateEventAttachment>} */
export const LateUpdateEvent = new EventTopic();

/** @typedef {CanvasRenderingContext2D} DrawEventAttachment */
/** @type {PriorityEventTopic<DrawEventAttachment>} */
export const DrawEvent = new PriorityEventTopic();

export async function main() {
  const m = await init();
  requestAnimationFrame(createAnimationFrameLoop((e) => {
    EarlyUpdateEvent.dispatchImmediately(e.detail);
    UpdateEvent.dispatchImmediately(e.detail);
    DrawEvent.dispatchImmediately(m.getState(DisplayPortProvider).ctx);
    LateUpdateEvent.dispatchImmediately(e.detail);
  }));
}

async function init() {
  const systemManager = new SystemManager();
  systemManager
    .register(DisplayPortProvider)
    .register(InputPortProvider)
    .register(EntityManagerProvider, undefined, (state) => state.reset())
    .register(AssetManagerProvider)
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

  if (!BackgroundMusic.current.isPlaying()) {
    BackgroundMusic.current.play({ loop: true });
  }
}

export async function AssetManagerProvider(m) {
  const assets = new AssetManager();
  await cacheAssetPackAsRaw(assets, 'res.pack');
  return assets;
}

export function InputPortProvider() {
  /** @type {InputPort} */
  const inputs = document.querySelector('#inputs');
  const ctx = inputs.getContext('axisbutton');
  ctx.bindBindings(Object.values(Inputs));

  EarlyUpdateEvent.on(({ currentTime: now }) => {
    ctx.poll(now);
  });
  return { inputs, ctx };
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

export function useEarlyUpdate(m, updateCallback) {
  useEventTopic(m, EarlyUpdateEvent, updateCallback);
}

export function useUpdate(m, updateCallback) {
  useEventTopic(m, UpdateEvent, updateCallback);
}

export function useDraw(m, layerIndex, drawCallback) {
  m.before(() => {
    DrawEvent.on(layerIndex, drawCallback);
    return () => {
      DrawEvent.off(drawCallback);
    };
  });
}

export function useLateUpdate(m, updateCallback) {
  useEventTopic(m, LateUpdateEvent, updateCallback);
}

export function useEventTopic(m, eventTopic, callback) {
  m.before(() => {
    eventTopic.on(callback);
    return () => {
      eventTopic.off(callback);
    };
  })
}

export function useCanvas(m) {
  let displayPort = useSystem(m, DisplayPortProvider);
  return displayPort.canvas;
}
