const { NavigationSystem } = require('./menu/NavigationSystem.js');

function init(world)
{
    world.commandCenter.attachSystemModule('navigation', new NavigationSystem());
}

module.exports = { init };
