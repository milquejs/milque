import { Mouse } from '@milque/input';
import { FixedSpriteGLRenderer2d } from 'src/deprecated/fixedgl/FixedSpriteGLRenderer2d.js';
import { MessageBox } from './MessageBox.js';
import { load } from './Render.js';

/**
 * @param {import('../../game/Game.js').Game} game
 */
export async function main(game) {
  const { display, assets } = game;
  const canvas = display.canvas;
  const renderer = new FixedSpriteGLRenderer2d(canvas);
  await load(assets, renderer);
  const mouse = new Mouse(canvas);

  let text = assets.getAsset('txt:tablev3.md');
  console.log(text);

  let messagebox = new MessageBox();
  messagebox.pushMessage('Hello world!', { color: 0xff0000 });
  messagebox.pushMessage('What are you doing?');

  display.addEventListener('frame', (e) => {
    const { deltaTime } = e.detail;

    if (mouse.Button0.pressed) {
      if (messagebox.isWaitingForNext()) {
        messagebox.nextMessage();
      }
    }

    renderer.prepare();

    renderer.pushScaling(2, 2);
    renderer.color(0xffffff);
    renderer.zLevel(100);
    renderer.draw('lizard_m_idle_anim', 0, 16, 16, 0);
    renderer.popTransform();

    messagebox.step(deltaTime / 60);

    let margin = 40;
    messagebox.draw(
      renderer,
      margin,
      display.height - 200,
      display.width - margin,
      display.height - margin
    );
  });
}
