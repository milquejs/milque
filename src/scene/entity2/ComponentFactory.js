const VOID = () => {};

/**
 * @template T
 */
export class ComponentFactory {
  /**
   *
   * @param {string} name
   * @param {() => T} newCallback
   * @param {(t: T) => void} [deleteCallback]
   */
  constructor(name, newCallback, deleteCallback = VOID) {
    this.name = name;
    this.new = newCallback;
    this.delete = deleteCallback;
  }
}
