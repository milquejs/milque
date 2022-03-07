export const IMINO = [
  { w: 1, h: 4, m: [1, 1, 1, 1] },
  { w: 4, h: 1, m: [1, 1, 1, 1] },
];
export const OMINO = [{ w: 2, h: 2, m: [1, 1, 1, 1] }];
export const TMINO = [
  { w: 3, h: 2, m: [0, 1, 0, 1, 1, 1] },
  { w: 2, h: 3, m: [1, 0, 1, 1, 1, 0] },
  { w: 3, h: 2, m: [1, 1, 1, 0, 1, 0] },
  { w: 2, h: 3, m: [0, 1, 1, 1, 0, 1] },
];
export const LMINO = [
  { w: 2, h: 3, m: [1, 0, 1, 0, 1, 1] },
  { w: 3, h: 2, m: [0, 0, 1, 1, 1, 1] },
  { w: 2, h: 3, m: [1, 1, 0, 1, 0, 1] },
  { w: 3, h: 2, m: [1, 1, 1, 1, 0, 0] },
];
export const JMINO = [
  { w: 2, h: 3, m: [0, 1, 0, 1, 1, 1] },
  { w: 3, h: 2, m: [1, 0, 0, 1, 1, 1] },
  { w: 2, h: 3, m: [1, 1, 1, 0, 1, 0] },
  { w: 3, h: 2, m: [1, 1, 1, 0, 0, 1] },
];
export const ZMINO = [
  { w: 3, h: 2, m: [1, 1, 0, 0, 1, 1] },
  { w: 2, h: 3, m: [0, 1, 1, 1, 1, 0] },
];
export const SMINO = [
  { w: 3, h: 2, m: [0, 1, 1, 1, 1, 0] },
  { w: 2, h: 3, m: [1, 0, 1, 1, 0, 1] },
];

export const ALL = [IMINO, OMINO, TMINO, JMINO, LMINO, SMINO, ZMINO];

let minw = Infinity;
let minh = Infinity;
let maxw = 1;
let maxh = 1;
for (let tetromino of ALL) {
  for (let shape of tetromino) {
    minw = Math.min(shape.w, minw);
    minh = Math.min(shape.h, minh);
    maxw = Math.max(shape.w, maxw);
    maxh = Math.max(shape.h, maxh);
  }
}

export const MIN_WIDTH = minw;
export const MIN_HEIGHT = minh;
export const MAX_WIDTH = maxw;
export const MAX_HEIGHT = maxh;
