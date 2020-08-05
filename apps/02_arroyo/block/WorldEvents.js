export const UPDATE_EVENT = 'update';

export function emitUpdateEvent(world)
{
    world.emit(UPDATE_EVENT, world);
}
