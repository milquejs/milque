/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

import { Eventable } from '@milque/util';

export class Game {
  /**
   * @param {DisplayPort} display
   * @param {InputContext} inputs
   * @param {AssetPack} assets
   */
  constructor(display, inputs, assets) {
    this.display = display;
    this.inputs = inputs;
    this.assets = assets;

    this.deltaTime = 0;
    this.prevTime = 0;
    this.now = 0;

    /** @private */
    this.events = Eventable.create();
  }

  on(event, callback) {
    this.events.on(event, callback);
    return this;
  }

  off(event, callback) {
    this.events.off(event, callback);
    return this;
  }

  once(event, callback) {
    this.events.once(event, callback);
    return this;
  }

  emit(event, ...args) {
    this.events.emit(event, ...args);
  }
}
