class ItemManager {
  constructor() {
    this.itemStacks = new Map();
    this.items = new Map();

    this._nextItemStackId = 1;
  }

  clear() {
    this.items.clear();
    this.itemStacks.clear();
  }

  registerItem(itemId, item) {
    this.items.set(itemId, item.setItemId(itemId));
    return this;
  }

  unregisterItem(itemId) {
    this.items.delete(itemId);
    return this;
  }

  getItemById(itemId) {
    return this.items.get(itemId);
  }

  createItemStack(itemId, stackSize = 1, metadata = {}) {
    let stackId = this.getNextAvailableItemStackId();
    this.itemStacks.set(stackId, { itemId, stackSize, metadata });
    return stackId;
  }

  destroyItemStack(stackId) {
    this.itemStacks.delete(stackId);
  }

  getItemStackById(stackId) {
    return this.itemStacks.get(stackId);
  }

  getNextAvailableItemStackId() {
    return this._nextItemStackId++;
  }
}

module.exports = { ItemManager };
