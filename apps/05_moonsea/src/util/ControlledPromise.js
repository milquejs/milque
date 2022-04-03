export class ControlledPromise extends Promise {
  constructor() {
    super((resolve, _) => resolve());

    /** @private */
    this._completed = false;
    /** @private */
    this._resolved = false;
    /** @private */
    this._resolve = null;
    /** @private */
    this._reject = null;
    /** @private */
    this._promise = new Promise((resolve, reject) => {
      if (this._completed) {
        if (this._resolved) {
          resolve(this._resolve);
        } else {
          reject(this._reject);
        }
      } else {
        /** @private */
        this._resolve = resolve;
        /** @private */
        this._reject = reject;
      }
    });
  }

  get pending() {
    return !this._completed;
  }

  resolve(value) {
    if (this._completed) {
      return;
    }
    this._completed = true;
    if (this._resolve) {
      this._resolve(value);
    } else {
      this._resolved = true;
      this._resolve = value;
      this._reject = null;
    }
  }

  reject(reason) {
    if (this._completed) {
      return;
    }
    this._completed = true;
    if (this._reject) {
      this._reject(reason);
    } else {
      this._resolved = false;
      this._resolve = null;
      this._reject = reason;
    }
  }

  /** @override */
  then(onfulfilled = undefined, onrejected = undefined) {
    return this._promise.then(onfulfilled, onrejected);
  }

  /** @override */
  catch(onrejected = undefined) {
    return this._promise.catch(onrejected);
  }

  /** @override */
  finally(onfinally = undefined) {
    return this._promise.finally(onfinally);
  }
}
