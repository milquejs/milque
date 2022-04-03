/**
 * @typedef {import('../SystemManager.js').SystemManager} SystemManager
 */

export class ManagerBase {
    
    /** @type {SystemManager} */
    constructor(systems) {
        this.systems = systems;
    }
}
