import { useInterval } from './Hooks.js';

const UPDATE_EVENT = {
    type: 'update',
    now: 0,
    dt: 0,
};

export function UpdateSystem(m, updatesPerSecond = 60) {
    const millisPerUpdate = 1_000 / updatesPerSecond;
    const [dispatchEvent] = useEventDispatcher(m);
    const [flushEvents] = useEventController(m);
    useInterval(m, now => {
        let prev = UPDATE_EVENT.now;
        UPDATE_EVENT.now = now;
        UPDATE_EVENT.dt = now - prev
        dispatchEvent(UPDATE_EVENT);
        flushEvents();
    }, millisPerUpdate);
}

export function useUpdate(m, callback) {
    useEvent(m, UPDATE_EVENT.type, callback);
}
