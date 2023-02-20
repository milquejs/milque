/**
 * @template T
 */
export class ComponentClass {
    /**
     * @param {string} name 
     * @param {() => T} newCallback
     * @param {(component: T) => void} [deleteCallback] 
     */
    constructor(name, newCallback = () => null, deleteCallback = () => {}) {
        this.name = name;
        this.new = newCallback;
        this.delete = deleteCallback;
    }
}
