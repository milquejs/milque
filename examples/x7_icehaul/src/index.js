const { GameSequence } = require('./game/index.js');

const stars = require('./stars.js');
const items = require('./items.js');
const player = require('./player.js');

const { CommandCenter } = require('./menu/CommandCenter.js');
const CommandCenterMenu = require('./menu/CommandCenterMenu.js');

const { NavigationSystem } = require('./menu/NavigationSystem.js');

async function main()
{
    let world = {
        day: 0,
        state: {},
        commandCenter: new CommandCenter(),
    };

    world.commandCenter.attachSystemModule('navigation', new NavigationSystem());

    stars.init(world);
    items.init(world);
    player.init(world);

    GameSequence.setNextScene(CommandCenterMenu, world);
    await GameSequence.start();
}

main();
