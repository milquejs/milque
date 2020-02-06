const { say, ask, pause, branch } = require('./output/index.js');
const { GameSequence } = require('./game/index.js');
const { Random } = require('./lib/random.js');

const stars = require('./stars.js');
const items = require('./items.js');
const { ItemContainer } = require('./world/item/ItemContainer.js');

const MenuMainCommand = require('./MenuMainCommand.js');

async function main()
{
    let world = {
        day: 0,
        state: {}
    };

    stars.init(world);
    items.init(world);

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
        inventory: new ItemContainer(),
    };

    world.player.inventory.addItemStack(world.items.createItemStack('fuel'));

    console.clear();

    // GameSequence.setNextScene(MenuMainCommand, world);
    // GameSequence.setNextScene(require('./MenuInventory.js'), world, world.player.inventory); // TEST
    GameSequence.setNextScene(require('./MenuCommandCenter.js'), world, world.player.inventory); // TEST
    GameSequence.start();
}

main();
