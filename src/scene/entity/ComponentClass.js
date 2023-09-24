/**
 * @template T
 * @callback ComponentNewCallback
 * @returns {T}
 */

/**
 * @template T
 * @callback ComponentDeleteCallback
 * @param {T} component
 */

/**
 * @template T
 */
export class ComponentClass {
  /**
   * @param {string} name
   * @param {ComponentNewCallback<T>} [newCallback]
   * @param {ComponentDeleteCallback<T>} [deleteCallback]
   */
  constructor(
    name,
    newCallback = () => /** @type {T} */ (null),
    deleteCallback = () => {},
  ) {
    /** @type {string} */
    this.name = name;
    /** @type {ComponentNewCallback<T>} */
    this.new = newCallback;
    /** @type {ComponentDeleteCallback<T>} */
    this.delete = deleteCallback;
  }
}
