const { ItemContainer } = require('./world/item/ItemContainer.js');

function init(world)
{
    world.player = {
        fuel: 10,
        maxFuel: 10,
        x: 0, y: 0,
        get system() { return world.starmap.getNearestStarSystem(this.x, this.y); },
        location: null,
        destination: {
            system: null,
            location: null,
        },
        inventory: new ItemContainer(world.itemManager),
    };

    world.player.inventory.addItemStack(world.itemManager.createItemStack('fuel'));
}

module.exports = { init };