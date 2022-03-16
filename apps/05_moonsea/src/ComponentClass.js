
/**
 * @template T
 */
export class ComponentClass {
    /**
     * 
     * @param {string} name 
     * @param {() => T} factory 
     */
    constructor(name, factory) {
        this.name = name;
        this.factory = factory;
    }

    /**
     * @returns {T}
     */
    create() {
        return this.factory();
    }

    /**
     * @param {T} component 
     */
    delete(component) {
        // Just accept it.
    }
}
