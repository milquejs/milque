/**
 * @typedef {object} MilqueContext
 */

/**
 * @param {MilqueContext} m
 * @param {string} type
 * @returns {Array<Function>}
 */
function resolveListeners(m, type) {
    let map;
    if ('listeners' in m) {
        map = m.listeners;
    } else {
        map = {
            [type]: [],
        };
        m.listeners = map;
    }
    if (type in map) {
        return map[type];
    } else {
        let result = [];
        map[type] = result;
        return result;
    }
}

/**
 * @param {MilqueContext} m 
 * @param {string} type 
 * @param {Function} callback 
 */
export function addListener(m, type, callback) {
    let listeners = resolveListeners(m, type);
    listeners.push(callback);
}

/**
 * @param {MilqueContext} m 
 * @param {string} type 
 * @param {Function} callback 
 */
export function removeListener(m, type, callback) {
    let listeners = resolveListeners(m, type);
    let i = listeners.indexOf(callback);
    if (i >= 0) {
        listeners.splice(i, 1);
    }
}

/**
 * @param {MilqueContext} m 
 * @param {string} type
 */
export function getListeners(m, type) {
    let listeners = resolveListeners(m, type);
    return listeners;
}

export function applyListeners(m, type, args) {
    let listeners = resolveListeners(m, type);
    for(let listener of listeners) {
        listener.apply(undefined, args);
    }
}

export function callListeners(m, type, ...args) {
    let listeners = resolveListeners(m, type);
    for(let listener of listeners) {
        listener.call(undefined, ...args);
    }
}
