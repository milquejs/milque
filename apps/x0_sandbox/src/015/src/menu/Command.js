class Command {
  constructor() {
    this._name = null;
    this._alwaysVisible = true;
  }

  setName(name) {
    this._name = name;
    return this;
  }

  getName() {
    return this._name;
  }

  setAlwaysVisible(value) {
    this._alwaysVisible = value;
    return this;
  }

  isAlwaysVisible() {
    return this._alwaysVisible;
  }

  validate(world) {
    return true;
  }
  async execute(world) {}
  getDisplayMessage(world) {
    return `[COMMAND] #${Math.random()}`;
  }

  /** @override */
  toString() {
    return this._name;
  }
}

module.exports = { Command };
