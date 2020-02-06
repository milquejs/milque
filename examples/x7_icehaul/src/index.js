const { say, ask, pause, branch } = require('./output/index.js');
const { StarMap } = require('./world/index.js');
const { GameSequence } = require('./game/index.js');
const { Random } = require('./lib/random.js');

const MenuMainCommand = require('./MenuMainCommand.js');
const MenuMarket = require('./MenuMarket.js');

async function main()
{
    let world = {
        day: 0,
        starmap: new StarMap(),
    };

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
        inventory: [],
    };

    console.clear();

    await say('Welcome back, captain.');

    // GameSequence.setNextScene(MenuMainCommand, world);
    GameSequence.setNextScene(MenuMarket, world); // TEST
    GameSequence.start();
}

main();
