import { ControlledPromise } from '../util/ControlledPromise.js';
import { useEffect, useSystem, useSystemManager } from './SystemManager.js';

/** @typedef {import('./SystemManager.js').SystemContext} SystemContext */

function FishSystem(m) {
    useLoad(m, async () => {
        await FishImage.load();
    });

    whenLoaded(m, function FishLoader(m) {
        useInit(m, () => {
            updateReady('init');
            return () => {
            };
        });
        useUpdate(m, () => {
        });
        useLateUpdate(m, () => {
        });
    });
    
    whenEffect(m, function FishRenderer(m) {
        const displayPort = useDisplayPort(m);
        useRenderPass(m, () => {
            
        });
    });
}

export function useLoad(m, asyncLoader) {
    const loadSystem = useSystem(m, LoadSystem);
    loadSystem.register(m.name, asyncLoader);
}

export function whenLoaded(m, subSystem) {
    const loadSystem = useSystem(m, LoadSystem);
    loadSystem.loaded(m.name)
    const manager = useSystemManager(m);
    manager.subStart(subSystem);
}

const LOAD_STATUS = {
    IDLE: 0,
    ACTIVE: 1,
};

/**
 * @param {SystemContext} m
 */
export function LoadSystem(m) {
    const loaders = {
        before: {},
        after: {},
        status: {},
    };

    function register(key, loader) {
        if (!(key in loaders.before)) {
            loaders.before[key] = [];
            loaders.after[key] = [];
            loaders.status[key] = new ControlledPromise();
        }
        let befores = loaders.before[key];
        befores.push(loader);

        // Load it now if actively loading...
        if (loaders.status === LOAD_STATUS.ACTIVE) {
            let afters = loaders.after[key];
            loadImpl(befores, afters);
        }
    }

    function loaded(key) {
        return loaders.loaded;
    }

    async function load() {
        let promises = [];
        for(let key of Object.keys(loaders.before)) {
            let befores = loaders.before[key];
            let afters = loaders.after[key];
            let promise = loadImpl(befores, afters);
            promises.push(promise);
        }
        await Promise.all(promises);
    }

    async function unload() {
        let promises = [];
        for(let key of Object.keys(loaders.after)) {
            let befores = loaders.before[key];
            let afters = loaders.after[key];
            let promise = unloadImpl(befores, afters);
            promises.push(promise);
        }
        await Promise.all(promises);
    }

    return {
        register,
        load,
        unload,
    };
}

async function loadImpl(befores, afters) {
    let promises = [];
    let prev = befores.slice();
    befores.length = 0;
    for(let loader of prev) {
        let result = loader();
        promises.push(result);
    }
    await Promise.all(promises).then(values => {
        for(let value of values) {
            if (typeof value === 'function') {
                afters.push(value);
            }
        }
    });
}

async function unloadImpl(befores, afters) {
    let promises = [];
    let prev = afters.slice();
    afters.length = 0;
    befores.length = 0;
    for(let loader of prev) {
        let result = loader();
        promises.push(result);
    }
    await Promise.all(promises);
}
