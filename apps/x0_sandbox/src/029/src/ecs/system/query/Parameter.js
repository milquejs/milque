export class Parameter {
  constructor(type) {
    this.type = type;
  }

  /** @abstract */
  accept(target) {
    return false;
  }
  /** @abstract */
  reject(target) {
    return false;
  }
}

export class IncludedParameter extends Parameter {
  /** @override */
  accept(target) {
    return target === this.type;
  }
}

export class ExcludedParameter extends Parameter {
  /** @override */
  reject(target) {
    return target === this.type;
  }
}

export class OptionalParameter extends Parameter {}
