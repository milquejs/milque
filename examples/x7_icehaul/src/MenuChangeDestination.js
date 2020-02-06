const { say, style, branch } = require('./output/index.js');
const { math } = require('./util/index.js');

module.exports = async function run(world, fromX, fromY, fromLocation, searchRadius)
{
    let fromSystem = world.starmap.getNearestStarSystem(fromX, fromY);

    let options = {};

    let systems = world.starmap.getStarSystemsWithinRange(fromX, fromY, searchRadius);
    let currentSystemIndex = systems.indexOf(fromSystem);
    if (currentSystemIndex >= 0) systems.splice(currentSystemIndex, 1);
    for(let system of systems)
    {
        let dist = Math.max(1, Math.round(math.distance2(fromX, fromY, system.x, system.y) * 100) / 100);
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
}
