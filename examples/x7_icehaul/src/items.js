const { ItemManager } = require('./world/item/ItemManager.js');
const { ItemBase } = require('./world/item/ItemBase.js');

function init(world)
{
    world.items = new ItemManager();

    world.items.registerItem('fuel', new ItemBase('Fuel Cell', 1));
    world.items.registerItem('nutrient', new ItemBase('Nutrient Meal', 10));
}

module.exports = { init };
