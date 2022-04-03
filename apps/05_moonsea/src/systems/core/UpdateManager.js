import { ManagerBase } from './ManagerBase.js';

export class UpdateManager extends ManagerBase{
    constructor(updatesPerSecond = 60, updater) {
        super();

        /** @private */
        this.intervalHandle = 0;

        this.updater = updater;

        this.updatesPerSecond = Math.max(0, updatesPerSecond);
        this.update = this.update.bind(this);
    }

    update() {
        this.updater();
    }

    /** @override */
    onPostInitialize() {
        if (this.updatesPerSecond <= 0) {
            return;
        }
        this.intervalHandle = setInterval(
            this.update,
            1_000 / this.updatesPerSecond
        );
    }

    /** @override */
    onPostTerminate() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = 0;
        }
    }
}
