const { distance2 } = require('../../lib/math.js');
const { StarSystem } = require('./StarSystem.js');

class StarMap
{
    constructor()
    {
        this.systems = [];
    }

    createStarSystem(name, x, y, attributes = {})
    {
        let result = new StarSystem(name, x, y, attributes);
        this.systems.push(result);
        return result;
    }

    getLocationsForStarSystem(starSystem)
    {
        let dst = [];
        dst.push(...starSystem.locations);
        return dst;
    }
    
    getNearestStarSystem(x, y)
    {
        let minDistance = Infinity;
        let minResult = null;
        let distance;
        for(let system of this.systems)
        {
            distance = distance2(x, y, system.x, system.y);
            if (distance < minDistance)
            {
                minDistance = distance;
                minResult = system;
            }
        }
        return minResult;
    }

    getStarSystemsWithinRange(x, y, distance)
    {
        let dst = [];
        for(let system of this.systems)
        {
            if (distance2(x, y, system.x, system.y) <= distance)
            {
                dst.push(system);
            }
        }
        return dst;
    }
}

module.exports = { StarMap };
