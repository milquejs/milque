import { Toaster } from '../lib/toaster/index.js';
import { Assets } from './Assets.js';
import { Inputs } from './Inputs.js';

export async function runAsteroidGame() {
    await Toaster.preloadAssetPack();
    await Toaster.preloadAssets(Assets);
    await Toaster.connectInputs(Inputs);
    
    const display = Toaster.getDisplayPort();
    const input = Toaster.getInputPort();
    
    const gl = /** @type {WebGL2RenderingContext} */ (display.getContext('webgl2'));
    const ab = input.getContext('axisbutton');
    
    display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
        const { deltaTime, now } = e.detail;
        const dt = deltaTime / 60;
        ab.poll(now);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    });
}
