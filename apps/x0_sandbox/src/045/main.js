import { FixedGLWorld2d } from 'src/deprecated/fixedgl/FixedGLWorld2d.js';

/** @typedef {import('src/audio/Sound.js').Sound} Sound */

/** @param {import('src/lib/game/Game.js').Game} game */
export async function main(game) {
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
    if (inputs.isButtonPressed('activate')) {
      player.x = Math.random() * display.width;
      player.y = Math.random() * display.height;
      let pop = /** @type {Sound} */ (assets.get('sound:pop.wav'));
      playVariation(pop, -10, 10);
    }
  });
}

function playVariation(sound, lowPitchRange, highPitchRange, gain = 1) {
  let range = highPitchRange - lowPitchRange;
  sound.play({ pitch: lowPitchRange + Math.random() * range, gain });
}
