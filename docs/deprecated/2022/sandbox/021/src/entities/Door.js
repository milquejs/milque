import { World } from '../World.js';
import { GameObject } from './GameObject.js';

World.require('assets');

export class Door extends GameObject {
  constructor(x = 0, y = 0) {
    super();

    const { assets } = World.getWorld();
    this.add('Transform', { x, y });
    this.add('Renderable', { renderType: 'sprite' });
    this.add('Sprite', {
      subTexture: assets.dungeon.getSubTexture('doors_leaf_closed'),
    });
    this.add('Collidable', {
      masks: {
        main: { x, y: y + 4, rx: 16, ry: 8 },
      },
    });
    this.add('Solid');
    this.add('Openable');
  }
}
