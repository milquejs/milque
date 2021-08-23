/**
 * @typedef {import('../game/Game.js').Game} Game
 */

const maxDistanceX = 2;
const moveSpeed = 0.015;
const friction = 0.15;
const inverseFriction = 1 - friction;

export class Starship
{
    constructor()
    {
        this.x = 0;
        this.dx = 0;
        this.dr = 0;
    }

    update(game)
    {
        let moveDir = game.inputs.getAxisValue('strafe');
        if (Math.sign(moveDir) !== Math.sign(this.x) || Math.abs(this.x) < maxDistanceX)
        {
            this.dx += game.inputs.getAxisValue('strafe') * moveSpeed;
        }
        else
        {
            this.x = Math.min(2, Math.max(-2, this.x));
        }
        this.dx *= inverseFriction;
        this.dr += this.dx;
        this.dr *= 0.8;
        this.x += this.dx;
    }

    /**
     * @param {FixedRenderer3d} renderer 
     */
    render(renderer)
    {
        renderer.transform.pushTransformMatrix();
        {
            renderer.transform.translate(this.x, 0, 5);
            renderer.transform.rotateZ(-this.dr);
            renderer.transform.scale(1, 0.5, 1);
            renderer.drawCube();
        }
        renderer.transform.popTransformMatrix();
    }
}
