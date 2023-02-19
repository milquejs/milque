const { ItemManager } = require('./world/item/ItemManager.js');
const { ItemBase } = require('./world/item/ItemBase.js');

function init(world) {
  world.itemManager = new ItemManager();

  world.itemManager.registerItem('fuel', new ItemBase('Fuel Cell', 1));
  world.itemManager.registerItem('nutrient', new ItemBase('Nutrient Meal', 10));
}

module.exports = { init };
