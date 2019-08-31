import BVH from './BVH.js';
import Circle from './Circle.js';
import Polygon from './Polygon.js';
import Point from './Point.js';
import SAT from './SAT.js';

const BOX_POINTS = [
	[-0.5, -0.5],
	[-0.5, 0.5],
	[0.5, 0.5],
	[0.5, -0.5],
];

class CollisionManager
{
    constructor(broadPhase = null, narrowPhase = null)
    {
        this.broadPhase = broadPhase || new BVH();
        this.narrowPhase = narrowPhase;
    }

	addCircle(x = 0, y = 0, radius = 0, scale = 1, padding = 0)
	{
		const body = new Circle(x, y, radius, scale, padding);
		this.broadPhase.insert(body);
		return body;
	}

	addBox(x = 0, y = 0, width = 0, height = 0, angle = 0, scale = 1, padding = 0)
	{
		const body = new Polygon(x, y, BOX_POINTS, angle, width * scale, height * scale, padding);
		this.broadPhase.insert(body);
		return body;
	}

	addPolygon(x = 0, y = 0, points = [[0, 0]], angle = 0, scale_x = 1, scale_y = 1, padding = 0)
	{
		const body = new Polygon(x, y, points, angle, scale_x, scale_y, padding);
		this.broadPhase.insert(body);
		return body;
	}

    addPoint(x = 0, y = 0, padding = 0)
    {
		const body = new Point(x, y, padding);
		this.broadPhase.insert(body);
		return body;
    }

    add(...bodies)
    {
		for (const body of bodies)
		{
			this.broadPhase.insert(body, false);
		}

		return this;
    }

    remove(...bodies)
    {
		for (const body of bodies)
		{
			this.broadPhase.remove(body, false);
        }
        
		return this;
    }

    update()
    {
        this.broadPhase.update();
        // this.narrowPhase.update();
        return this;
    }

    potentials(body)
    {
		return this.broadPhase.potentials(body);
    }

    collides(body, target, result = null)
    {
        return SAT(body, target, result, true);
    }
}

export default CollisionManager;
