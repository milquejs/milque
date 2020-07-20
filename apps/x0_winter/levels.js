import { IntersectionHelper } from './lib.js';

const WIDTH = 300;
const HEIGHT = 150;

export const level1 = {
    start: { x: 100, y: 100 },
    exit: { x: 0, y: 0 },
    statics: [
        { left: 50, top: 0, right: 150, bottom: 16 },
        { left: 20, top: 30, right: 30, bottom: 110 },
        { left: 0, top: 0, right: 10, bottom: HEIGHT },
        { left: 0, top: 0, right: WIDTH, bottom: 10 },
        { left: WIDTH - 10, top: 0, right: WIDTH, bottom: HEIGHT },
        { left: 0, top: HEIGHT - 10, right: WIDTH, bottom: HEIGHT },
    ],
};

export function createLevel(levelInfo)
{
    let statics = [];
    for(let staticInfo of levelInfo.statics)
    {
        statics.push(IntersectionHelper.createRect(staticInfo.left, staticInfo.top, staticInfo.right, staticInfo.bottom));
    }
    return {
        start: levelInfo.start,
        exit: levelInfo.exit,
        statics,
    };
}