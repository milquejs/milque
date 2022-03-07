class CommandCenter {
  static parse(object, dst = new CommandCenter()) {
    dst.powered = object.powered;
    return dst;
  }

  static objectify(src, object = {}) {
    object.powered = src.powered;
    return object;
  }

  constructor() {
    this.systems = new Map();
    this.commands = new Map();

    this.powered = false;
    this.info = [];
  }

  registerCommand(name, command) {
    this.commands.set(name, command.setName(name));
    return this;
  }

  unregisterCommand(name) {
    this.commands.delete(name);
    return this;
  }

  getCommandByName(name) {
    return this.commands.get(name);
  }

  getCommands() {
    return this.commands.values();
  }

  attachSystemModule(name, systemModule) {
    this.systems.set(name, systemModule.setName(name));
    systemModule.onAttach(this);
    return this;
  }

  detachSystemModule(name) {
    let system = this.systems.get(name);
    this.systems.delete(name);
    system.onDetach(this);
    return this;
  }

  getSystemModuleByName(name) {
    return this.systems.get(name);
  }

  getSystemModules() {
    return this.systems.values();
  }
}

module.exports = { CommandCenter };
