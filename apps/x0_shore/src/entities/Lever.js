import { GameObject } from './GameObject.js';

export class Lever extends GameObject
{
    constructor()
    {
        super();

        this.add('Transform');
        this.add('Renderable');
    }
}
