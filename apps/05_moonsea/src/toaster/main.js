import { SystemManager, useEffect } from './SystemManager.js';
import { EventSystem, useEvent } from './EventSystem.js';

/**
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 */

export async function Toaster() {
    let sm = new SystemManager();
    await sm.start([
        EventSystem,
    ]);

    console.log('READY!');
    await sm.stop();
    console.log('STOPED');
}

function MainSystem(m) {
    whenEvent(['game:loaded'], () => {
        useEvent(m, 'game:update', (world) => {

        });
        useEvent(m, 'game:render', (ctx) => {

        });
    });
}

function LoadSystem() {

}

function useLoad(m, handler) {
    useEffect(m, handler);
}

function whenEvent(events, callback) {

}
