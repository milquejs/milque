const { say, pause, style, branch } = require('../output/index.js');
const { distance2 } = require('../lib/math.js');

module.exports = { init };

async function init(world)
{
    if (!world.state.commands) throw new Error('Missing dependency.');

    world.state.commands.on('poweron', async () => {
        world.state.commands.addCommand({
            message: '[NAVIGATION] Set destination...',
            callback: () => commandSetDestination(world, world.player.x, world.player.y, world.player.location, 10),
        }, 'setdest');
    });

    world.state.commands.on('poweron', async () => {
        world.state.commands.addCommand({
            message: '[NAVIGATION] Continue to destination.',
            callback: () => gotoDestination(world),
            get disabled() { return !world.player.destination.system; }
        }, 'gotodest');
    });

    world.state.commands.on('info', async () => {
        await say(
            `\n${'=-'.repeat(20)} Day ${world.day + 1}`
            + `\n= Current System: ${style.system(world.player.system)}`
            + `\n= Current Location: ${style.location(world.player.location)}`
            + `\n= Destination: ${style.destination(world.player.destination)}`
            + `\n= Fuel: ${style.fuel(world.player.fuel, world.player.maxFuel, -world.player.destination.cost)}`
            + `\n${'=-'.repeat(20)}`
        );
    });
}

async function commandSetDestination(world, fromX, fromY, fromLocation, searchRadius)
{
    let fromSystem = world.starmap.getNearestStarSystem(fromX, fromY);

    let options = {};

    let systems = world.starmap.getStarSystemsWithinRange(fromX, fromY, searchRadius);
    let currentSystemIndex = systems.indexOf(fromSystem);
    if (currentSystemIndex >= 0) systems.splice(currentSystemIndex, 1);
    for(let system of systems)
    {
        let dist = Math.max(1, Math.round(distance2(fromX, fromY, system.x, system.y) * 100) / 100);
        options[`${style.system(system)} (${dist}u away)`] = () => setDestination(world, system, null, Math.ceil(dist));
    }
    
    let locations = world.starmap.getLocationsForStarSystem(fromSystem);
    let currentLocationIndex = locations.indexOf(fromLocation);
    if (currentLocationIndex >= 0) locations.splice(currentLocationIndex, 1);
    for(let location of locations)
    {
        options[`${style.location(location)}`] = () => setDestination(world, fromSystem, location);
    }

    await branch('To where?', options);
}

async function setDestination(world, targetSystem, targetLocation = null, cost = 1)
{
    world.player.destination.system = targetSystem;
    world.player.destination.location = targetLocation;
    world.player.destination.cost = cost;

    await say(`...setting course to ${style.destination({ system: targetSystem, location: targetLocation, cost })}.`);
    
    await say.newline();
    await pause();
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
