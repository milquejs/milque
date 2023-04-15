import { AssetRef } from '@milque/asset';
import { RunModule, Runner, install, using, useFrameEffect, installAs, useProviderEffect, useRunnerEffect } from '../runner2';
import { AppModule, AssetProvider, EntityProvider, InputProvider } from './Providers';
import { InputBinding } from '@milque/input';

export async function GameModule(m) {
    await install(m, RunModule);
    await install(m, AppModule);
    await install(m, GameSystem);
}

export async function startGame(game) {
    let m = {};
    await installAs(m, GameProvider, () => game);
    await install(m, GameModule);
    await install(m, async function Starter(m) {
        const runner = using(m, Runner);
        await runner.start();
    });
}

export async function GameSystem(m) {
    let assets = using(m, AssetProvider);
    let inputs = using(m, InputProvider);

    const game = using(m, GameProvider);
    const GameClass = /** @type {typeof Game} */ (game.constructor);

    await install(m, ...GameClass.providers);
    game.onSystem(m);

    await Promise.all(GameClass.assetRefs.map(def => def instanceof AssetRef && def.load(assets)));
    await Promise.all(GameClass.inputBindings.map(def => def instanceof InputBinding && def.bindKeys(inputs)));
    await game.onPreload(m);
    
    useRunnerEffect(m, 0, () => {
        game.onInit(m);
        return () => game.onDead(m);
    });
    useFrameEffect(m, 0, () => {
        game.onUpdate(m);
        game.onDraw(m);
    });
}

export function GameProvider() {
    return new Game();
}

export class Game {

    /** @type {Array<AssetRef>} */
    static get assetRefs() { return []; }
    /** @type {Array<InputBinding>} */
    static get inputBindings() { return []; }
    /** @type {Array<import('../runner2').Provider<?>>} */
    static get providers() { return []; }

    onSystem(m) {}

    async onPreload(m) {}
    onInit(m) {}
    onDead(m) {}

    onUpdate(m) {}
    onDraw(m) {}
}
