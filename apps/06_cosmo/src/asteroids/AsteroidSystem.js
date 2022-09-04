import { ChunkSystem } from './systems/ChunkSystem.js';
import { CursorSystem } from './systems/CursorSystem.js';

export function AsteroidSystem(m) {
    ChunkSystem(m);
    CursorSystem(m);
}
