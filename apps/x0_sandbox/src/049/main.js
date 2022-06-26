import { PerspectiveCamera } from '@milque/scene';
import { DrawContextFixedGLText } from 'src/renderer/drawcontext/DrawContextFixedGLText.js';
import '../dialogue/DialogueArea.js';

document.title = 'roomie';

/** @param {import('../game/Game.js').Game} game */
export async function main(game) {
    const gl = /** @type {WebGLRenderingContext} */ (game.display.getContext('webgl'));
    gl.clearColor(0, 0, 0, 1);

    const camera = new PerspectiveCamera(30, 0.01, 1000);
    const renderer = new DrawContextFixedGLText(gl, undefined, camera);
    game.on('frame', () => {
        draw(renderer);
    });
}

/**
 * @param {DrawContextFixedGLText} renderer
 */
function draw(renderer) {
    renderer.clear(0, 0, 0);
    renderer.reset();

    renderer.setColor(0xFF00FF);
    renderer.drawBox(0, 0, 10, 10);
}
