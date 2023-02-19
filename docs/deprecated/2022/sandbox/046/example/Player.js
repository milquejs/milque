import { Component } from './Component.js';

export const PlayerComponent = Component.fromSchema('player', {
  x: 0,
  y: 0,
});

export const PositionComponent = Component.fromSchema('position', {
  x: 0,
  y: 0,
});

export function setPosition(instance, x, y) {
  instance.x = x;
  instance.y = y;
}

export async function onLoad() {}

export async function onUnload() {}

export function onCreate(world) {
  const { entityManager } = world;
  let player = entityManager.createEntity();
  entityManager.addComponent(player, PlayerComponent);
  setPosition(entityManager.getComponent(player, PlayerComponent), 0, 0);
}

export function onUpdate(dt) {}
