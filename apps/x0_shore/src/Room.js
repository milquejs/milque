import { World } from './World.js';
import { Wall } from './entities/Wall.js';
import { Door } from './entities/Door.js';

export function createRoom(x, y, width, height)
{
    const { entityManager } = World.getWorld();
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const wallDepth = 4;
    const halfDoorWidth = 16;
    const walls = [
        // Top
        new Wall(x - halfWidth, y - halfHeight, x + halfWidth, y - halfHeight + wallDepth),
        // Left
        new Wall(x - halfWidth, y - halfHeight, x - halfWidth + wallDepth, y + halfHeight),
        // Right
        new Wall(x + halfWidth - wallDepth, y - halfHeight, x + halfWidth, y + halfHeight),
        // BottomLeft
        new Wall(x - halfWidth, y + halfHeight - wallDepth, x - halfDoorWidth, y + halfHeight),
        // BottomRight
        new Wall(x + halfDoorWidth, y + halfHeight - wallDepth, x + halfWidth, y + halfHeight),
    ];
    const door = new Door(x, y + halfHeight);
    return {
        walls,
        door,
    };
}