import { AssetManager } from '@milque/asset';
import { EntityManager } from '@milque/scene';

import { Override, useContext, useWhenSystemDraw, useWhenSystemInit, useWhenSystemPreload, useWhenSystemUpdate } from '../runner';

import * as Room from './Room';

/**
 * @template M, T
 * @typedef {import('../runner/Provider').Provider<M, T>} Provider
 */

/**
 * @typedef CanvasLike
 * @property {number} width
 * @property {number} height
 * @property {(contextId: string, opts: object) => RenderingContext} getContext
 */

/**
 * @template M
 * @typedef RoomSystemOptionsObject
 * @property {import('../runner/Provider').Provider<M, CanvasLike>} CanvasProvider
 * @property {import('../runner/Provider').Provider<M, AssetManager>} AssetProvider
 * @property {import('../runner/Provider').Provider<M, EntityManager>} EntityProvider
 * @property {Record<string, import('@milque/asset').AssetLoader<?, ?>>} loaders
 * @property {import('./Room').Defs} defs
 */

/**
 * @template M
 * @param {RoomSystemOptionsObject<M>} options
 */
export function RoomSystemOptions(options) {
    /**
     * @param {M} m
     */
    function RoomSystemOptionsImpl(m) {
        return options;
    }
    return Override(RoomSystemOptions, RoomSystemOptionsImpl);
}

/**
 * @template M
 * @param {M} m
 */
export function useRoomSystemOptions(m) {
    // @ts-ignore
    return /** @type {RoomSystemOptionsObject<M>} */ (useContext(m, RoomSystemOptions));
}

export function useRoom(m) {
    return useContext(m, RoomSystem);
}

export function RoomSystem(m) {
    // NOTE: What if `useContext()` => `using()`?
    let ctx = useContext(m, CanvasContextProvider);
    let { loaders, defs, AssetProvider, EntityProvider } = useRoomSystemOptions(m);
    let ents = useContext(m, EntityProvider);
    let assets = useContext(m, AssetProvider);
    let roomNames = Room.getRoomNames(defs);
    let room = Room.newRoom(roomNames[0], loaders, assets, ents, defs);

    // NOTE: What if `useWhen()` => `when()`?
    useWhenSystemPreload(m, 0, async () => {
        await room.preload();
    });

    useWhenSystemInit(m, 0, () => {
        room.init();
    });

    useWhenSystemUpdate(m, 0, ({ detail: { deltaTime }}) => {
        room.step(deltaTime);
    });

    useWhenSystemDraw(m, 0, () => {
        room.draw(ctx);
    });
    return room;
}

export const RoomSystemProviders = [CanvasContextProvider];

export function CanvasContextProvider(m) {
    let options = useRoomSystemOptions(m);
    let canvas = useContext(m, options.CanvasProvider);
    return /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
}

/*
// TODO: Default providers.
export function CanvasProvider(m) {
    return document.createElement('canvas');
}

export function EntityProvider(m) {
    let ents = new EntityManager();
    useWhenSystemUpdate(m, -1, () => ents.flush());
    return ents;
}

export function AssetProvider(m) {
    return new AssetManager();
}
*/