/**
 * @template T
 */
export class Topic {

    /**
     * @abstract
     * @param {T} [attachment] 
     */
    dispatch(attachment = null) {}

    /**
     * @abstract
     * @param {T} [attachment] 
     */
    dispatchImmediately(attachment = null) {}

    /**
     * @abstract
     * @param {number} max 
     */
    flush(max = 1000) {}
}
