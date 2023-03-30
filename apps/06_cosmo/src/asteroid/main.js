import { DisplayPort } from '@milque/display';
import { InputPort } from '@milque/input';
import { AssetManager, cacheAssetPackAsRaw } from '@milque/asset';
import { EntityManager, TopicManager, Topic, AnimationFrameLoop } from '@milque/scene';

import * as Inputs from './Inputs.js';

import { PlayerSystem } from './Player.js';
import { ParticleSystem } from './Particle.js';
import { PowerUpSystem } from './PowerUp.js';
import { BulletSystem } from './Bullet.js';

import { StarfieldSystem } from './Starfield.js';
import { useEffect, useSystem } from './lib/M';
import { SystemManager } from './lib/system/SystemManager.js';
import { AsteroidGame, BackgroundMusic, NextLevelEvent } from './AsteroidGame.js';
import { AsteroidSystem } from './Asteroid.js';

export async function main() {
  const systemManager = new SystemManager();
  systemManager
    .register(LifeCycleSystem)
    .register(DisplayPortProvider)
    .register(InputPortProvider)
    .register(EntityManagerProvider, undefined, (state) => state.reset())
    .register(AssetManagerProvider)
    .register(TopicManagerProvider, undefined, (state) => state.reset())
    .register(AsteroidGame)
    .register(StarfieldSystem)
    .register(ParticleSystem)
    .register(PlayerSystem)
    .register(BulletSystem)
    .register(PowerUpSystem)
    .register(AsteroidSystem);
  await systemManager.start();
}

/**
 * @param {AsteroidGame} scene 
 */
export function nextLevel(scene) {
  scene.level++;
  scene.gamePause = false;
  scene.showPlayer = true;

  NextLevelEvent.dispatch(scene.topics, scene.level);

  if (!BackgroundMusic.current.isPlaying()) {
    BackgroundMusic.current.play({ loop: true });
  }
}

/** @typedef {{ deltaTime: number, currentTime: number }} UpdateEventAttachment */
/** @type {Topic<UpdateEventAttachment>} */
export const EarlyUpdateEvent = new Topic('update.early');
/** @type {Topic<UpdateEventAttachment>} */
export const UpdateEvent = new Topic('update');
/** @type {Topic<UpdateEventAttachment>} */
export const LateUpdateEvent = new Topic('update.late');
/** @typedef {CanvasRenderingContext2D} DrawEventAttachment */
/** @type {Topic<DrawEventAttachment>} */
export const DrawEvent = new Topic('draw');

export function LifeCycleSystem(m) {
  const topics = useSystem(m, TopicManagerProvider);
  useTopic(m, SystemUpdateEvent, 0, (e) => {
    EarlyUpdateEvent.dispatch(topics, e.detail);
    UpdateEvent.dispatch(topics, e.detail);
    DrawEvent.dispatch(topics, m.getState(DisplayPortProvider).ctx);
    LateUpdateEvent.dispatch(topics, e.detail);
  });
}

/** @type {Topic<AnimationFrameLoop>} */
export const SystemUpdateEvent = new Topic('system.update');

export function TopicManagerProvider(m) {
  const topics = new TopicManager();
  
  useEffect(m, () => {
    const loop = new AnimationFrameLoop((e) => {
      SystemUpdateEvent.dispatch(topics, e);
      topics.flush();
    });
    loop.start();
    return () => {
      loop.cancel();
    }
  });

  return topics;
}

export async function AssetManagerProvider(m) {
  const assets = new AssetManager();
  await cacheAssetPackAsRaw(assets, 'res.pack');
  return assets;
}

export function InputPortProvider(m) {
  /** @type {InputPort} */
  const inputs = document.querySelector('#inputs');
  const ctx = inputs.getContext('axisbutton');
  ctx.bindKeys(Inputs);
  useTopic(m, EarlyUpdateEvent, 0, ({ currentTime: now }) => {
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

export function EntityManagerProvider(m) {
  let entities = new EntityManager();
  useTopic(m, UpdateEvent, 0, () => entities.flush());
  return entities;
}

export function useEarlyUpdate(m, updateCallback) {
  useTopic(m, EarlyUpdateEvent, 0, updateCallback);
}

export function useUpdate(m, updateCallback) {
  useTopic(m, UpdateEvent, 0, updateCallback);
}

export function useDraw(m, layerIndex, drawCallback) {
  useTopic(m, DrawEvent, layerIndex, drawCallback);
}

export function useLateUpdate(m, updateCallback) {
  useTopic(m, LateUpdateEvent, 0, updateCallback);
}

export function useTopic(m, topic, priority, callback) {
  let topics = useSystem(m, TopicManagerProvider);
  m.before(() => {
    topic.on(topics, priority, callback);
    return () => {
      topic.off(topics, callback);
    };
  });
}

export function useCanvas(m) {
  let displayPort = useSystem(m, DisplayPortProvider);
  return displayPort.canvas;
}
