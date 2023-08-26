import { AxisBinding, ButtonBinding, KeyCodes } from '@/input';

/**
 * @template {Record<string, import('@/input').InputBinding> & {
 *  click: import('@/input').InputBinding,
 *  posX: import('@/input').InputBinding,
 *  posY: import('@/input').InputBinding,
 * }} Bindings
 */
export class Tio {

  static get DEFAULT_BINDINGS() {
    return {
      click: new ButtonBinding('tio.click', [
        KeyCodes.MOUSE_BUTTON_0,
        KeyCodes.MOUSE_BUTTON_2,
      ]),
      posX: new AxisBinding('tio.pos.x', KeyCodes.MOUSE_POS_X),
      posY: new AxisBinding('tio.pos.y', KeyCodes.MOUSE_POS_Y),
      up: new ButtonBinding('tio.up', [KeyCodes.KEY_W, KeyCodes.ARROW_UP]),
      left: new ButtonBinding('tio.left', [
        KeyCodes.KEY_A,
        KeyCodes.ARROW_LEFT,
      ]),
      down: new ButtonBinding('tio.down', [
        KeyCodes.KEY_S,
        KeyCodes.ARROW_DOWN,
      ]),
      right: new ButtonBinding('tio.right', [
        KeyCodes.KEY_D,
        KeyCodes.ARROW_RIGHT,
      ]),
      a: new ButtonBinding('tio.a', KeyCodes.KEY_Z),
      b: new ButtonBinding('tio.b', KeyCodes.KEY_X),
      space: new ButtonBinding('tio.space', KeyCodes.SPACE),
    };
  }

  /**
   * @param {Bindings} bindings
   */
  constructor(bindings) {
    /** @private */
    this.x = 0;
    /** @private */
    this.y = 0;
    /** @private */
    this.w = 1;
    /** @private */
    this.h = 1;

    this.bindings = bindings;

    /** @private */
    this.gamepadContext = new GamepadContext();
    // TODO: Support multiple players.
  }

  /**
   * @param {import('@/input').InputContext} axb
   */
  bindKeys(axb) {
    // TODO: Is there a better way than binding?
    for(let binding of Object.values(this.bindings)) {
      binding.bindKeys(axb);
    }
  }

  /**
   * @param {import('@/input').InputContext} axb
   */
  poll(axb) {
    axb.poll();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  camera(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  /**
   * @param {number} index 
   */
  gamepad(index) {
    return this.gamepadContext.setGamepadIndex(index);
  }

  /** @param {import('@/input').InputContext} axb */
  click(axb) {
    return axb.isButtonReleased(this.bindings.click.name);
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {number} [fromX]
   * @param {number} [fromY]
   * @param {number} [toX]
   * @param {number} [toY]
   */
  hover(
    axb,
    fromX = Number.NEGATIVE_INFINITY,
    fromY = Number.NEGATIVE_INFINITY,
    toX = Number.POSITIVE_INFINITY,
    toY = Number.POSITIVE_INFINITY,
  ) {
    let x = this.x + axb.getAxisValue(this.bindings.posX.name) * this.w;
    let y = this.y + axb.getAxisValue(this.bindings.posY.name) * this.h;
    return x >= fromX && x <= toX && y >= fromY && y <= toY;
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {keyof Bindings} key
   * @param {number} gamepadIndex
   */
  btn(axb, key, gamepadIndex = 0) {
    return this.hold(axb, key);
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {keyof Bindings} key
   * @param {number} gamepadIndex
   */
  axis(axb, key, gamepadIndex = 0) {
    return this.value(axb, key);
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {keyof Bindings} key
   * @param {number} gamepadIndex
   */
  down(axb, key, gamepadIndex = 0) {
    return axb.isButtonPressed(this.bindings[key].name);
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {keyof Bindings} key
   * @param {number} gamepadIndex
   */
  up(axb, key, gamepadIndex = 0) {
    return axb.isButtonReleased(this.bindings[key].name);
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {keyof Bindings} key
   * @param {number} gamepadIndex
   */
  hold(axb, key, minTime = 0, gamepadIndex = 0) {
    // TODO: Add holding time.
    return axb.isButtonDown(this.bindings[key].name);
  }

  /**
   * @param {import('@/input').InputContext} axb
   * @param {keyof Bindings} key
   * @param {number} gamepadIndex
   */
  value(axb, key, gamepadIndex = 0) {
    return axb.getInputValue(this.bindings[key].name);
  }
}

class GamepadContext {
  constructor() {
    this.index = 0;
  }

  /** @param {number} index */
  setGamepadIndex(index) {
    this.index = index;
    return this;
  }

  leftX() {
  }

  leftY() {
  }

  rightX() {
  }

  rightY() {
  }

  dpad() {
  }

  btn() {
  }
}
