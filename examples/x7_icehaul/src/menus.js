const { GameSequence } = require('./game/index.js');

const MenuCommandCenter = require('./menu/MenuCommandCenter.js');

function init(world)
{
    MenuCommandCenter.init(world);
}

function start(world)
{
    GameSequence.setNextScene(MenuCommandCenter, world);
    GameSequence.start();
}

module.exports = { init, start };