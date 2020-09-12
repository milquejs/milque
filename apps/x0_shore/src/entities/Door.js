import { World } from '../World.js';
import { GameObject } from './GameObject.js';

World.require('assets');

export class Door extends GameObject
{
    constructor(x = 0, y = 0)
    {
        super();

        const { assets } = World.getWorld();
        this.add('Transform', { x, y });
        this.add('Renderable', { renderType: 'sprite' });
        this.add('Sprite', { textureStrip: assets.dungeon.getSubTexture('doors_all') });
        this.add('Collidable', { masks: {
            main: { x, y: y + 4, rx: 32, ry: 4 },
            activate: { x, y, rx: 16, ry: 16 },
        }});
        this.add('Solid', { masks: ['main'] });
    }
}
