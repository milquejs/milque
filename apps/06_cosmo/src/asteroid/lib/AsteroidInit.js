/** @typedef {import('./Scene').Scene} Scene */

export class FrameLayerManager {
    constructor() {
        this.weightedList = [];
    }

    addLayer(layerIndex, callback) {
        this.weightedList.push({
            index: layerIndex,
            callback: callback,
        });
        this.weightedList.sort((a, b) => {
            return a.index - b.index;
        });
    }

    removeLayer(layerIndex, callback) {
        let i = this.weightedList.findIndex(v => v.index === layerIndex && v.callback === callback);
        if (i < 0) {
            return;
        }
        this.weightedList.splice(i, 1);
    }

    dispatch(ctx) {
        for(let { callback } of this.weightedList) {
            callback(ctx);
        }
    }
}

/**
 * @param {Scene} m 
 * @param {Function} callback 
 */
export function useFrameUpdate(m, layerIndex, callback) {
    useEffect(m, () => {
        m.frames.addLayer(layerIndex, callback);
        return () => {
            m.frames.removeLayer(layerIndex, callback);
        };
    });
}

/**
 * @param {Scene} m 
 * @param {Function} callback 
 */
export function useFirstUpdate(m, callback) {
    useEvent(m, 'first', callback);
}

/**
 * @param {Scene} m 
 * @param {Function} callback 
 */
export function useLastUpdate(m, callback) {
    useEvent(m, 'last', callback);
}

/**
 * @param {Scene} m 
 * @param {Function} callback 
 */
export function useUpdate(m, callback) {
    useEvent(m, 'update', callback);
}

/**
 * @param {Scene} m 
 * @param {Function} callback 
 */
export function useFixedUpdate(m, callback) {
    useEvent(m, 'fixed', callback);
}

/**
 * @param {Scene} m 
 * @param {string} event
 * @param {Function} callback 
 */
export function useEvent(m, event, callback) {
    m.currentScene.use(() => {
        m.currentScene.on(event, callback);
        return () => {
            m.currentScene.off(event, callback);
        };
    });
}

/**
 * @param {Scene} m 
 * @param {Function} callback 
 */
export function useEffect(m, callback) {
    m.currentScene.use(callback);
}
