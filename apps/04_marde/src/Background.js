import { Random } from '@milque/random';

const LAYERS = ['back', 'main', 'fore'];
const LAYER_COLORS = {
  back: '#000000',
  main: '#333333',
  fore: '#888888',
};
const LAYER_SPEED = {
  back: 0.3,
  main: 0.5,
  fore: 1,
};
const LAYER_OFFSET = {
  back: 0,
  main: -8,
  fore: -16,
};
const WEIGHTED_LAYERS = [
  'back',
  'back',
  'back',
  'back',
  'main',
  'main',
  'fore',
];

const MAX_BUILDING_COUNT = 80;
const BUILDING_RAND = new Random();
const BUILDING_LAYER_RAND = () => BUILDING_RAND.choose(WEIGHTED_LAYERS);
const BUILDING_POS_RAND = (max) => Math.trunc(BUILDING_RAND.range(0, max));
const BUILDING_WIDTH_RAND = () => Math.trunc(BUILDING_RAND.range(16, 32));
const BUILDING_HEIGHT_RAND = () => Math.trunc(BUILDING_RAND.range(36, 80));

const RAILING_WIDTH = 80;
const RAILING_HEIGHT = 8;
const RAILING_SPEED = 6;

const ROAD_HEIGHT = 64;

function createBuilding(world) {
  const layer = 'main';
  const building = {
    x: 0,
    width: 36,
    height: 16,
    layer: layer,
  };
  world.background.buildings.push(building);
  world.background.buildingLayers[layer].push(building);
  return building;
}

function randomizeBuilding(world, building) {
  building.x = BUILDING_POS_RAND(world.display.width);
  building.width = BUILDING_WIDTH_RAND();
  building.height = BUILDING_HEIGHT_RAND();

  let prevLayer = building.layer;
  let nextLayer = BUILDING_LAYER_RAND();
  let layers = world.background.buildingLayers;
  layers[prevLayer].splice(layers[prevLayer].indexOf(building), 1);
  layers[nextLayer].push(building);
  building.layer = nextLayer;
}

export function load(world) {
  world.background = {
    buildingLayers: {
      fore: [],
      back: [],
      main: [],
    },
    buildings: [],
    progress: 0,
  };

  for (let i = 0; i < MAX_BUILDING_COUNT; ++i) {
    let b = createBuilding(world);
    randomizeBuilding(world, b);
  }
}

export function update(dt, world) {
  world.background.progress += dt;

  for (let layer of LAYERS) {
    for (let building of world.background.buildingLayers[layer]) {
      if (building.x > world.display.width) {
        randomizeBuilding(world, building);
        building.x -= world.display.width + building.width;
      } else {
        building.x += LAYER_SPEED[layer];
      }
    }
  }
}

export function render(ctx, world) {
  const worldWidth = world.display.width;
  const worldHeight = world.display.height;

  // Draw sky
  ctx.fillStyle = '#561435';
  ctx.fillRect(0, 0, worldWidth, worldHeight);
  ctx.fillStyle = '#8e3e13';
  ctx.fillRect(0, 0, worldWidth, worldHeight / 3);
  ctx.fillStyle = '#a09340';
  ctx.fillRect(0, 0, worldWidth, worldHeight / 10);
  ctx.fillStyle = '#e8d978';
  ctx.fillRect(0, 0, worldWidth, worldHeight / 30);

  // Draw parallax buildings
  for (let layer of LAYERS) {
    ctx.fillStyle = LAYER_COLORS[layer];
    for (let building of world.background.buildingLayers[layer]) {
      drawBuilding(ctx, world, building);
    }
  }
  const roadOffsetY = worldHeight - ROAD_HEIGHT;

  // Draw railings
  ctx.fillStyle = '#000000';
  let y = roadOffsetY - RAILING_HEIGHT;
  let dx = (world.background.progress % RAILING_WIDTH) * RAILING_SPEED;
  ctx.translate(dx, y);
  for (
    let x = -RAILING_WIDTH * RAILING_SPEED;
    x < worldWidth;
    x += RAILING_WIDTH
  ) {
    ctx.translate(x, 0);
    drawRailing(ctx, world);
    ctx.translate(-x, 0);
  }
  ctx.translate(-dx, -y);

  // Draw road
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, roadOffsetY, worldWidth, ROAD_HEIGHT);
}

function drawRailing(ctx, world) {
  let railCount = 5;
  let railWidth = RAILING_WIDTH / railCount;
  for (let i = 0; i < railCount; ++i) {
    let x = i * railWidth;
    let t = x % 3;
    ctx.translate(x, 0);
    {
      ctx.fillRect(0, -t * 2, 3, RAILING_HEIGHT + t * 2);
      ctx.fillRect(8, 0, 3, RAILING_HEIGHT);
      ctx.fillRect(0, 2 + t, railWidth, 3);
    }
    ctx.translate(-x, 0);
  }
}

function drawBuilding(ctx, world, building) {
  let offsetY = LAYER_OFFSET[building.layer];
  let x = Math.trunc(building.x);
  let y = Math.trunc(
    world.display.height - ROAD_HEIGHT - building.height - offsetY
  );
  ctx.translate(x, y);
  {
    ctx.fillRect(0, 0, building.width, building.height + offsetY);
  }
  ctx.translate(-x, -y);
}
