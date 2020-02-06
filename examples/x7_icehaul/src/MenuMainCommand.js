const { say, ask, pause, style, branch } = require('./output/index.js');
const { GameSequence } = require('./game/index.js');

module.exports = async function run(world)
{
    await say('...running system diagnostics...');
    await printPlayerInfo(world);

    let options = {};

    // Communication
    options['[COMMUNICATION] Open link with local station...'] = () => console.log('Nothin happened.');
    options['[COMMUNICATION] Open trade with local market...'] = () => require('./MenuInventory.js')(world,  world.player.inventory);

    // Navigation
    if (world.player.fuel > 0)
    {
        if (!world.player.destination.system)
        {
            options['[NAVIGATION] Set course for...'] = () => require('./MenuChangeDestination.js')(world, world.player.x, world.player.y, world.player.location, world.player.fuel - 1);
        }
        else
        {
            options['[NAVIGATION] Change course...'] = () => require('./MenuChangeDestination.js')(world, world.player.x, world.player.y, world.player.location, world.player.fuel - 1);
            options['[COMMAND] Continue to destination.'] = () => gotoDestination(world);
        }
    }

    // Commands
    options['[COMMAND] Skip the day.'] = () => skipDay(world);
    options['[COMMAND] Go to sleep.'] = () => quitGame(world);

    await branch('What do you want to do?', options);
    
    // Loop...
    if (!GameSequence.getNextScene()) GameSequence.setNextScene(run, ...arguments);
}

async function printPlayerInfo(world)
{
    await say(
        `\n${'=-'.repeat(20)} Day ${world.day + 1}`
        + `\n= Current System: ${style.system(world.player.system)}`
        + `\n= Current Location: ${style.location(world.player.location)}`
        + `\n= Destination: ${style.destination(world.player.destination)}`
        + `\n= Fuel: ${style.fuel(world.player.fuel, world.player.maxFuel, -world.player.destination.cost)}`
        + `\n${'=-'.repeat(20)}`
    );
    await say();
}

async function gotoDestination(world)
{
    let player = world.player;
    
    await say('...moving to target destination: '
        + style.destination(player.destination)
        + '...');

    // Set location to destination
    let dx = player.destination.system.x;
    let dy = player.destination.system.y;
    let dl = player.destination.location;
    let dc = player.destination.cost;
    player.x = dx;
    player.y = dy;
    player.location = dl;
    player.fuel -= dc;
    world.day += dc;

    // Reset destination
    player.destination.system = null;
    player.destination.location = null;
    player.destination.cost = 0;

    await say();
    await pause();
}

async function skipDay(world)
{
    await say('...skipping the day...');
    ++world.day;

    await say();
    await pause();
}

async function quitGame(world)
{
    if (await ask.confirm('Are you sure you want to leave?'))
    {
        process.exit(0);
    }
    else
    {
        await say();
    }
}
