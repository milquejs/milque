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
     * @param {Array<T>} out 
     * @param {number} count 
     * @returns {Array<T>}
     */
    createAll(out = [], count = 1) {
        for(let i = 0; i < count; ++i) {
            let result = this.create();
            out.push(result);
        }
        return out;
    }

    /**
     * @param {T} component 
     */
    destroy(component) {
        // Just accept it.
    }

    /**
     * @param {Array<T>} components 
     */
    destroyAll(components) {
        for(let component of components) {
            this.destroy(component);
        }
    }
}
