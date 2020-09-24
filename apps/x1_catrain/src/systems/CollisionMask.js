import { createAxisAlignedBoundingBox } from '../aabb/AxisAlignedBoundingBoxIntersectionSolver.js';

export function CollisionMask(props)
{
    const {
        name = 'main',
        offsetX = 0,
        offsetY = 0,
        shapeType = 'aabb',
        shape = createAxisAlignedBoundingBox(0, 0, 16, 16),
        solid = true
    } = props;
    
    return {
        name,
        offsetX,
        offsetY,
        shapeType,
        shape,
        solid,
    };
}
CollisionMask.multiple = true;
