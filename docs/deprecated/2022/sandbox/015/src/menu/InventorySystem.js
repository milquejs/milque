const { ModuleSystem } = require('./ModuleSystem.js');
const { SimpleCommand } = require('./SimpleCommand.js');
const { say, pause, style } = require('../output/index.js');

class InventorySystem extends ModuleSystem {
  /** @override */
  onAttach(commandCenter) {
    commandCenter.registerCommand(
      'inv-view',
      new SimpleCommand('[INVENTORY] View inventory.', async (world) =>
        openInventory(world, world.player.inventory)
      )
    );
  }

  /** @override */
  onDetach(commandCenter) {
    commandCenter.unregisterCommand('inv-view');
  }
}

module.exports = { InventorySystem };

async function openInventory(world, inventory) {
  console.log('=== Inventory ===================');
  for (let stackId of inventory.getItemStacks()) {
    let itemStack = inventory.itemManager.getItemStackById(stackId);
    let item = inventory.itemManager.getItemById(itemStack.itemId);
    console.log(`${item.name} x${itemStack.stackSize}`);
  }
  console.log('=== ========= ===================');
  await pause();
}
