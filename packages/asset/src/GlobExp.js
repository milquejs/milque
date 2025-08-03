import { makeRe } from 'picomatch';

export class GlobExp {
    /**
     * @param {string|GlobExp} pattern 
     */
    constructor(pattern) {
        let source;
        if (typeof pattern === 'object' && pattern instanceof GlobExp) {
            source = pattern.source;
        } else {
            source = String(pattern);
        }
        this.source = source;

        /** @private */
        this._re = makeRe(source);
    }

    /**
     * @param {string} string 
     * @returns {boolean}
     */
    test(string) {
        return this._re.test(string);
    }
}
