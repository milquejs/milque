const { GameSequence } = require('./game/index.js');

const MenuCommandCenter = require('./menu/MenuCommandCenter.js');
const CommandShipDiagnostics = require('./menu/CommandShipDiagnostics.js');
const CommandNavigation = require('./menu/CommandNavigation.js');

function init(world)
{
    MenuCommandCenter.init(world);
    CommandShipDiagnostics.init(world);
    CommandNavigation.init(world);
}

function start(world)
{
    GameSequence.setNextScene(MenuCommandCenter, world);
    GameSequence.start();
}

module.exports = { init, start };