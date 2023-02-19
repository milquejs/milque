const { Command } = require('./Command.js');

class SimpleCommand extends Command {
  constructor(message = '[COMMAND] ???', executor = null, validator = null) {
    super();
    this._message = message;
    this._executor = executor;
    this._validator = validator;
  }

  /** @override */
  validate(world) {
    return this._validator ? this._validator.call(this, world) : true;
  }

  /** @override */
  async execute(world) {
    if (this._executor) await this._executor.call(this, world);
  }

  /** @override */
  getDisplayMessage(world) {
    return this._message;
  }
}

module.exports = { SimpleCommand };
