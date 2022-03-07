/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

const INSTANCE = Symbol('game');

export class Game {
  /**
   * @protected
   * @returns {Game}
   */
  static get INSTANCE() {
    return this[INSTANCE];
  }

  /** @returns {DisplayPort} */
  static get Display() {
    return this.INSTANCE.__displayPort;
  }

  /** @returns {HTMLCanvasElement} */
  static get Canvas() {
    return this.INSTANCE.__displayPort;
  }

  /** @returns {InputContext} */
  static get Inputs() {
    return this.INSTANCE.__inputContext;
  }

  /** @returns {AssetPack} */
  static get Assets() {
    return this.INSTANCE.__assetPack;
  }

  static initialize(documentElement = window.document) {
    if (documentElement.readyState === 'loading') {
      documentElement.addEventListener(
        'DOMContentLoaded',
        this.onDOMContentLoaded
      );
    } else {
      this.onDOMContentLoaded();
    }
  }

  /** @protected */
  static onDOMContentLoaded() {
    const display = document.querySelector('#display');
    const inputs = document.querySelector('#inputs').getContext('axisbutton');
    const assets = document.querySelector('#assets');

    let instance = {};
    this[INSTANCE] = instance;
    instance.__displayPort = display;
    instance.__displayCanvas = display.canvas;
    instance.__inputContext = inputs;
    instance.__assetPack = assets;
    return instance;
  }
}
