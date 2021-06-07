import { createSound } from './audio.js';

const SOUNDS = {};

export function sounds()
{
    return SOUNDS;
}

export async function loadSounds(assets)
{
    await Promise.all([
        registerSound('start', assets.files.get('res/start.wav')),
        registerSound('dead', assets.files.get('res/dead.wav')),
        registerSound('pop', assets.files.get('res/boop.wav')),
        registerSound('music', assets.files.get('res/music.wav')),
        registerSound('shoot', assets.files.get('res/click.wav')),
        registerSound('boom', assets.files.get('res/boom.wav')),
    ]);
}

async function registerSound(name, fileData)
{
    let arrayBuffer = new ArrayBuffer(fileData.byteLength);
    new Uint8Array(arrayBuffer).set(fileData);
    SOUNDS[name] = await createSound(arrayBuffer);
}
