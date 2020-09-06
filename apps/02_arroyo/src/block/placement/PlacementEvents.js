export const PLACE_EVENT = 'place';
export const BREAK_EVENT = 'break';

export function emitPlaceEvent(world, blockPos, blockId)
{
    world.emit(PLACE_EVENT, world, blockPos, blockId);
}

export function emitBreakEvent(world, blockPos, blockId)
{
    world.emit(BREAK_EVENT, world, blockPos, blockId);
}
