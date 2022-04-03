/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

export class ManagerBase {
    /**
     * @abstract
     * @param {SystemContext} m 
     */
    onSystemContextCreate(m) {}

    /**
     * @abstract
     * @param {SystemContext} m 
     */
    onSystemInitialize(m) {}

    /**
     * @abstract
     * @param {SystemContext} m 
     */
    onSystemReady(m) {}

    /**
     * @abstract
     * @param {SystemContext} m 
     */
    onSystemTerminate(m) {}

    /**
     * @abstract
     * @param {SystemContext} m 
     */
    onSystemUpdate(m) {}

    /**
     * @abstract
     * @param {SystemContext} m 
     * @param {Error} e
     */
    onSystemError(m, e) {}

    /**
     * @abstract
     */
    onPostInitialize() {}

    /**
     * @abstract
     */
    onPostUpdate() {}

    /**
     * @abstract
     */
    onPostTerminate() {}
}
