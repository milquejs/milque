import { GameObject } from './GameObject.js';

export class Wall extends GameObject
{
    constructor(left = 0, top = 0, right = left + 10, bottom = top + 10)
    {
        super();

        const width = right - left;
        const height = bottom - top;
        const rx = width / 2;
        const ry = height / 2;
        const x = left + rx;
        const y = top + ry;

        this.add('Transform', { x, y });
        this.add('Renderable', { renderType: 'wall', width, height });
        this.add('Collidable', { masks: { main: { x, y, rx, ry } } });
    }
}
