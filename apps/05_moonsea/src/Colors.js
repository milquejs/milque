import { hex } from './renderer/color.js';

export const DAYLIGHTS = [
  {
    stars: [0xfff4df],
    skies: [0xa7f4ff, 0xeaa5ee],
    streaks: [0x85c5ce, 0x6495cf],
    clouds: [[0xd0f2fb, 0xfbe7d0]],
    columns: [0xcaf4ff, 0xcafff3, 0x5bb8da],
    rows: [0xcaf4ff, 0x5bb8da, 0xcafff3],
    seas: [0x3b8ce6, 0xcafff3],
  },
  {
    stars: [0xffffff],
    skies: [0xfc9db5, 0xfff4d7],
    streaks: [0xf6dbaf, 0xfffee8],
    clouds: [
      [0xffffff, 0xfffee8],
      [0xffffff, 0xfffee8],
      [0xffffff, 0xfffee8],
      [0xc287ac, 0xa77193],
    ],
    columns: [0xffffff, 0xffffff, 0xffffff, 0xeff0c5, 0x7c6384],
    rows: [0xfffee7, 0xb998c3, 0xb789b9],
    seas: [0xfffee7, 0xb789b9],
  },
  {
    stars: [0xfafafa],
    skies: [0x8278b4, 0xb4bee6],
    streaks: [0xb4a0e6, 0xcdbff2],
    clouds: [[0xffffff, 0xe0eeff]],
    columns: [0xa2bee5, 0x5381c1, 0x4c4593],
    rows: [0x4979bc, 0x3865a5, 0x1b4f99, 0x184789],
    seas: [0x4979bc, 0x1b4f99],
  },
];

export function getDayIndex(worldTime, maxWorldTime) {
  const worldTimeRatio = worldTime / maxWorldTime;
  return Math.floor(worldTimeRatio * DAYLIGHTS.length);
}

export function getDayDelta(worldTime, maxWorldTime) {
  const DAY_INDEX_TIME = maxWorldTime / DAYLIGHTS.length;
  return (worldTime % DAY_INDEX_TIME) / DAY_INDEX_TIME;
}

export function mixDaylightColor(dayIndex, dayDelta, key, index) {
  let current = DAYLIGHTS[dayIndex];
  let next = DAYLIGHTS[dayIndex >= DAYLIGHTS.length - 1 ? 0 : dayIndex + 1];
  return hex.mix(current[key][index], next[key][index], dayDelta);
}

export function spicyDaylightColor(dayIndex, dayDelta, spicy, key) {
  let current = DAYLIGHTS[dayIndex];
  let next = DAYLIGHTS[dayIndex >= DAYLIGHTS.length - 1 ? 0 : dayIndex + 1];
  let currIndex = Math.floor(spicy * current[key].length);
  let nextIndex = Math.floor(spicy * next[key].length);
  let currValue = current[key][currIndex];
  let nextValue = next[key][nextIndex];
  return hex.mix(currValue, nextValue, dayDelta);
}

export function cloudyDaylightColor(dayIndex, dayDelta, spicy, key) {
  let current = DAYLIGHTS[dayIndex];
  let next = DAYLIGHTS[dayIndex >= DAYLIGHTS.length - 1 ? 0 : dayIndex + 1];
  let currIndex = Math.floor(spicy * current[key].length);
  let nextIndex = Math.floor(spicy * next[key].length);
  let currArray = current[key][currIndex];
  let nextArray = next[key][nextIndex];
  let result = [];
  for (let i = 0; i < currArray.length; ++i) {
    result.push(hex.mix(currArray[i], nextArray[i], dayDelta));
  }
  return result;
}
