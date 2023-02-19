/** @typedef {() => void|AfterEffectHandler|Promise<AfterEffectHandler>} EffectHandler */
/** @typedef {() => void|Promise<void>} AfterEffectHandler */

export class EffectManager {

    constructor() {
        /** @type {Array<EffectHandler>} */
        this.before = [];
        /** @type {Array<AfterEffectHandler|void>} */
        this.after = [];
        this.started = false;
    }

    /**
     * @param {EffectHandler} effectHandler
     */
    attachEffect(effectHandler) {
        if (this.started) {
            throw new Error('Cannot attach effect when already started.');
        }
        this.before.push(effectHandler);
        return this;
    }

    /**
     * @param {AfterEffectHandler} afterEffectHandler 
     */
    attachAfterEffect(afterEffectHandler) {
        if (this.started) {
            throw new Error('Cannot attach effect when already started.');
        }
        this.after.push(afterEffectHandler);
        return this;
    }

    async startEffects() {
        if (this.started) {
            throw new Error('Cannot start effects already started.');
        }
        this.started = true;
        let befores = this.before.slice();
        this.before.length = 0;
        this.after.push(...await Promise.all(befores.map(effect => effect && effect())));
    }

    async stopEffects() {
        if (!this.started) {
            throw new Error('Cannot stop effects not yet started.');
        }
        this.started = false;
        let afters = this.after.slice().reverse();
        this.after.length = 0;
        await Promise.all(afters.map(effect => effect && effect()));
    }
}
