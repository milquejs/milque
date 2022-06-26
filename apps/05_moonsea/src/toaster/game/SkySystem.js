/** @typedef {import('../SystemManager.js').SystemContext} SystemContext */

import { useEvent, useEventDispatcher } from '../SystemManager.js';

/**
 * @param {SystemContext} m 
 */
export function SkySystem(m) {
    const display = useDisplayPort();

    useLoad(m, async () => {

    });
    useInit(m, () => {

    });

    whenGameReady(m, (game) => {
        useUpdate(m, (dt) => {
    
        });
    });

    whenRendererReady(m, (renderer) => {
        useRender(m, RENDER_PASS_SKY, (dt) => {
        });
    });
}

function SkySystem2(m) {
    let dispatchRenderEvent = useEventDispatcher(m, 'load', SkySystem2);
    useEvent(m, 'load', () => [

    ]);

    dispatchRenderEvent(dt);
    
    m.on('load', async () => {
    });

    m.on('init', () => {
    });

    m.on('update', (dt) => {
    });

    m.on('render', (dt) => {
    });
}

function RenderSystem(m) {
    m.on('render', (dt) => {
        m.sendTo([
            SkySystem2,
        ], 'render', dt);
    });
}
