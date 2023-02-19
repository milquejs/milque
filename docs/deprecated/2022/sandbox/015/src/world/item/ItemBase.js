class ItemBase {
  constructor(name, maxStackSize = 1) {
    this.id = null;
    this.name = name;

    this.size = 1;
    this.maxStackSize = maxStackSize;
    this.description = `A plain ol' item.`;
    this.attributes = {};
  }

  setItemId(id) {
    this.id = id;
    return this;
  }
}

module.exports = { ItemBase };
