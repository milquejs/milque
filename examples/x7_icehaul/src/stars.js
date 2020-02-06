const { StarMap } = require('./world/star/StarMap.js');

function init(world)
{
    world.starmap = new StarMap();
    world.starmap.createStarSystem('Solar', 0, 0)
        .addStar('Sol')
        .addObject('Mercury')
        .addObject('Venus')
        .addObject('Earth')
        .addObject('Mars');
    world.starmap.createStarSystem('Endar', 2, 3)
        .addStar('Ende')
        .addObject('Reus')
        .addObject('Odelia')
        .addObject('Rolan')
        .addObject('Juniper');
    world.starmap.createStarSystem('Sentar', 1, -1)
        .addStar('Sen')
        .addObject('Kuno')
        .addObject('Meldite')
        .addObject('Gogorim');
}

module.exports = { init };
