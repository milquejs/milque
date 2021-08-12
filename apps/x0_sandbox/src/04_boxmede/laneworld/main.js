/**
 * @typedef {import('../game/Game.js').Game} Game
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

/**
 * @param {Game} game
 */
export async function main(game)
{
    const display = game.display;
    const input = game.inputs;
    input.bindAxis('cursorX', 'Mouse', 'PosX');
    input.bindAxis('cursorY', 'Mouse', 'PosY');
    input.bindButton('activate', 'Mouse', 'Button0');
    input.bindButton('deactivate', 'Mouse', 'Button2');
    const ctx = display.getContext('2d');
    game.on('frame', () => {
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
}