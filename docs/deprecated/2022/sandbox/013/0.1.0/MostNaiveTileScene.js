import { POS_X, POS_Y, LEFT_DOWN, RIGHT_CLICK } from './util/MouseControls.js';

import { TileMap, loadTileSheet } from './MostNaiveTileMap.js';
import { Random } from './milque.js';

// This slows down at around 100x100

export async function load(game) {
  let dungeonSheet = await loadTileSheet(
    '../res/dungeon.png',
    '../res/dungeon.tiles'
  );
  this.tileSet = {
    ...dungeonSheet,
  };
  this.tileMap = new TileMap(10, 10, 8);
}

export function onStart() {
  this.tileMap.registerTile(0, { color: '#FF0000' });
  this.tileMap.registerTile(1, { color: '#00FF00' });
  this.tileMap.registerTile(2, { color: '#0000FF' });
  this.tileMap.registerTile(3, { image: this.tileSet.wall_left });
  this.tileMap.registerTile(4, { image: this.tileSet.wall_top_left });
  this.tileMap.registerTile(5, { image: this.tileSet.weapon_knife });

  for (let y = 0; y < this.tileMap.width; ++y) {
    for (let x = 0; x < this.tileMap.height; ++x) {
      this.tileMap.set(
        x,
        y,
        Random.randomChoose(Object.keys(this.tileMap.registry))
      );
    }
  }
}

export function onUpdate(dt) {
  if (LEFT_DOWN.value) {
    this.tileMap.performCarve();
  }

  if (RIGHT_CLICK.value) {
    this.tileMap.performNextSwatch();
  }
}

export function onRender(ctx, view, world) {
  world.tileMap.updatePointer(view, POS_X.value, POS_Y.value);
  world.tileMap.draw(ctx);
}
