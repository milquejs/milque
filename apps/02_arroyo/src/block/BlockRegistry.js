class BlockRegistry {
  constructor() {
    this.blocks = {};
    this.components = {};
  }

  register(blockId, ...components) {
    if (blockId in this.blocks) {
      throw new Error(`BlockId '${blockId}' already registered.`);
    }

    const componentOpts = components.map((opt) =>
      !Array.isArray(opt) ? [opt, true] : opt
    );
    for (let [component, initial] of componentOpts) {
      if (!(component in this.components)) this.components[component] = {};

      let blockComponents = this.components[component];

      if (blockId in blockComponents)
        throw new Error(
          `Component '${component}' for block '${blockId}' already registered.`
        );

      let value;
      if (typeof initial === 'object') {
        value = Object.assign({}, initial);
      } else {
        value = initial;
      }
      blockComponents[blockId] = value;
    }

    let block = new Block(this, blockId, componentOpts);

    this.blocks[blockId] = block;
    return block;
  }

  getBlock(blockId) {
    if (blockId in this.blocks) {
      return this.blocks[blockId];
    } else {
      return null;
    }
  }

  getBlocks() {
    return Object.values(this.blocks);
  }

  getBlockIds() {
    return Object.keys(this.blocks);
  }

  getBlockComponents(blockId) {
    let result = [];
    for (let blockComponents of this.components) {
      if (blockId in blockComponents) {
        result.push(blockComponents[blockId]);
      }
    }
    return result;
  }

  hasComponent(component, blockId) {
    return (
      component in this.components && blockId in this.components[component]
    );
  }

  getComponent(component, blockId) {
    if (component in this.components) {
      let blockComponents = this.components[component];
      if (blockId in blockComponents) {
        return blockComponents[blockId];
      }
    }
    return null;
  }

  getComponents(component) {
    if (component in this.components) {
      let blockComponents = this.components[component];
      return Object.values(blockComponents);
    }
  }

  getComponentNames() {
    return Object.keys(this.components);
  }
}

class Block {
  constructor(blockRegistry, blockId, componentOpts) {
    this.blockRegistry = blockRegistry;
    this.blockId = blockId;
    this.blockOpts = componentOpts;

    for (let [component, values] of componentOpts) {
      this[component] = blockRegistry.getComponent(component, blockId);
    }
  }

  /** @override */
  toString() {
    return `Block#${this.blockId}`;
  }
}

export const BLOCKS = new BlockRegistry();
