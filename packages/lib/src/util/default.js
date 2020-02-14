import { load, start, stop, unload } from './GameInterface.js';

export async function startUp(game)
{
    let instance = await load(game);
    return start(instance);
}

export async function nextUp(instance, nextGame)
{
    await shutDown(instance);
    return await startUp(nextGame);
}

export async function shutDown(instance)
{
    stop(instance);
    await unload(instance);
    return instance;
}
