const { NavigationSystem } = require('./menu/NavigationSystem.js');
const { InventorySystem } = require('./menu/InventorySystem.js');

function init(world)
{
    world.commandCenter.attachSystemModule('navigation', new NavigationSystem());
    world.commandCenter.attachSystemModule('inventory', new InventorySystem());
}

module.exports = { init };
