import { ByteReader, LITTLE_ENDIAN } from './ByteReader.js';

// https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md

export async function AsepriteLoader(filepath, opts = {}) {
  const aseData = await loadAsepriteData(filepath);
  console.log(JSON.stringify(aseData));
  return {};
}

async function loadAsepriteData(filepath) {
  const response = await fetch(filepath);
  const reader = new ByteReader(response.body);

  let frames = [];
  let header = await readHeader(reader);
  for (let frameIndex = 0; frameIndex < header.frames; ++frameIndex) {
    let frame = await readFrame(reader);
    frames.push(frame);
  }

  return {
    header,
    frames,
  };
}

async function readHeader(r) {
  r.setEndian(LITTLE_ENDIAN);
  const fileSize = await r.readDoubleWord();
  const magicNumber = await r.readWord();
  if (magicNumber !== 0xa5e0) {
    throw new Error('Invalid Aseprite header byte format.');
  }
  const frames = await r.readWord();
  const width = await r.readWord();
  const height = await r.readWord();
  const colorDepth = await r.readWord();
  const flags = await r.readDoubleWord();
  // const flagHasValidLayerOpacity = flags & 1 === 1;
  const speed = await r.readWord(); // Deprecated
  await r.readDoubleWord(); // Zeroes
  await r.readDoubleWord(); // Zeroes
  const transparentColor = await r.readByte();
  await r.seekBytes(3);
  const numColors = await r.readWord();
  const pixelWidth = await r.readByte();
  const pixelHeight = await r.readByte();
  const gridX = await r.readSignedWord();
  const gridY = await r.readSignedWord();
  const gridWidth = await r.readWord();
  const gridHeight = await r.readWord();
  await r.seekBytes(84);
  return {
    fileSize,
    frames,
    width,
    height,
    colorDepth,
    flags,
    speed,
    transparentColor,
    numColors,
    pixelWidth,
    pixelHeight,
    gridX,
    gridY,
    gridWidth,
    gridHeight,
  };
}

async function readFrame(r) {
  r.setEndian(LITTLE_ENDIAN);
  const frameBytes = await r.readDoubleWord();
  const magicNumber = await r.readWord();
  if (magicNumber !== 0xf1fa) {
    throw new Error('Invalid Aseprite frame header byte format.');
  }
  const oldNumChunks = await r.readWord();
  const frameDuration = await r.readWord();
  await r.readByte(); // Unused byte
  await r.readByte(); // Unused byte
  const newNumChunks = await r.readDoubleWord();

  let numChunks =
    oldNumChunks === 0xffff ? oldNumChunks + newNumChunks : oldNumChunks;

  let chunks = [];
  for (let i = 0; i < numChunks; ++i) {
    const size = await r.readDoubleWord();
    const type = await r.readWord();
    switch (type) {
      default:
        await r.seekBytes(size - 6);
    }
  }

  /*
    for(let i = 0; i < numChunks; ++i)
    {
        const size = await r.readDoubleWord();
        const type = await r.readWord();
        const data = await r.readBytes(size);
        console.log(size);
        chunks.push({
            size,
            type,
            data,
        });
    }
    */

  return {
    frameBytes,
    frameDuration,
    numChunks,
    chunks: [],
  };
}
