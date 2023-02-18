export class ProviderManager {
    constructor() {
        this.providers = {};
        this.values = {};
    }

    provide(handle, provider) {
        let prevProvider = this.providers[handle];
        if (prevProvider) {
            throw new Error('Cannot provide for duplicate handle.');
        }
        this.providers[handle] = provider;
        let prevValue = this.values[handle];
        if (!prevValue) {
            this.values[handle] = {};
        }
    }

    unprovide(handle) {
        delete this.providers[handle];
        delete this.values[handle];
    }

    consume(handle, context) {
        let prevValue = this.values[handle];
        if (prevValue) {
            return prevValue;
        }
        let provider = this.providers[handle];
        if (!provider) {
            let next = {};
            this.values[handle] = next;
            return next;
        } else {
            let next = provider.call({}, context);
            this.values[handle] = next;
            return next;
        }
    }
}

/**
 * @template T
 * @param {object} m 
 * @param {(m: object) => T} provider 
 * @param {string} handle 
 * @returns {T}
 */
export function useProvider(m, provider, handle = provider.name) {
    let providerManager = m.provides;
    providerManager.provide(handle, provider);
    return providerManager.consume(handle, m);
}

/**
 * @template T
 * @param {object} m 
 * @param {(m: object) => T} provider
 * @param {string} handle 
 * @returns {T}
 */
export function useContext(m, provider, handle = provider.name) {
    let providerManager = m.provides;
    return providerManager.consume(handle, m);
}
