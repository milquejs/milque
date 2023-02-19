import { Sprite } from '../Sprite.js';
import { GameObject } from '../GameObject.js';
import { BoxMask } from '../BoxMask.js';

export class Player extends GameObject {
  constructor() {
    super();

    this.sprite = new Sprite('image:toast.png', 8, 8);
    this.mask = new BoxMask(8, 8, 16, 16);
  }

  /** @override */
  onUpdate(world, dt) {
    super.onUpdate(world, dt);

    let { inputState } = world;
    let moveX = inputState.right - inputState.left;
    let moveY = inputState.down - inputState.up;
    const moveSpeed = 100;

    this.x += moveX * dt * moveSpeed;
    this.y += moveY * dt * moveSpeed;
  }
}
