import { ChunkMap } from './chunk/ChunkMap.js';

async function test1() {
  const chunkMap = new ChunkMap(-3, -3, 3, 3, 2, 2);
  const blockPos = chunkMap.at(-4, -4);
  console.log(blockPos.toString());

  function logBlockPos(blockPos) {
    console.log(blockPos.toString(true));
  }

  blockPos.right();
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
  logBlockPos(blockPos.down());
}

async function main() {
  await test1();
}

// main();
