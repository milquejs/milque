import { FixedGLWorld2d } from 'src/renderer/FixedGLWorld2d.js';

/** @typedef {import('src/audio/Sound.js').Sound} Sound */

/** @param {import('src/game/Game.js').Game} game */
export async function main(game)
{
    const { display, inputs, assets } = game;
    inputs.bindAxis('cursorX', 'Mouse', 'PosX');
    inputs.bindAxis('cursorY', 'Mouse', 'PosY');
    inputs.bindButton('activate', 'Mouse', 'Button0');
    inputs.bindButton('activate', 'Mouse', 'Button2');

    const world = new FixedGLWorld2d(game);
    await world.load();
    
    let player = world.createSprite('font.1');
    let gameOver = world.createText('Game Over');
    world.createObject();
    
    game.on('frame', () => {
        world.draw();
        gameOver.x = display.width / 2;
        gameOver.y = display.height / 2;
        if (inputs.isButtonPressed('activate'))
        {
            player.x = Math.random() * display.width;
            player.y = Math.random() * display.height;
            let pop = /** @type {Sound} */ (assets.getAsset('sound:pop.wav'));
            pop.play({ pitch: (Math.random() - 0.5) * 10, gain: 0.5 });
        }
    });
}
