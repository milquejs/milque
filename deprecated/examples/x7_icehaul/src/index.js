const { GameSequence } = require('./game/index.js');

const stars = require('./stars.js');
const items = require('./items.js');
const player = require('./player.js');
const modules = require('./modules.js');

const { ItemManager } = require('./world/item/ItemManager.js');
const { CommandCenter } = require('./menu/CommandCenter.js');
const CommandCenterMenu = require('./menu/CommandCenterMenu.js');

async function main()
{
    let world = {
        day: 0,
        state: {},
        itemManager: new ItemManager(),
        commandCenter: new CommandCenter(),
    };

    stars.init(world);
    items.init(world);
    player.init(world);
    modules.init(world);

    GameSequence.setNextScene(CommandCenterMenu, world);
    await GameSequence.start();
}

main();
