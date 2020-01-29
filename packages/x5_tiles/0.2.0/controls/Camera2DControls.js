import { Input } from '../milque.js';

export const CONTEXT = Input.createContext();
export const UP = CONTEXT.registerState('up', {
    'key[ArrowUp].up': 0,
    'key[ArrowUp].down': 1,
    'key[w].up': 0,
    'key[w].down': 1
});
export const DOWN = CONTEXT.registerState('down', {
    'key[ArrowDown].up': 0,
    'key[ArrowDown].down': 1,
    'key[s].up': 0,
    'key[s].down': 1
});
export const LEFT = CONTEXT.registerState('left', {
    'key[ArrowLeft].up': 0,
    'key[ArrowLeft].down': 1,
    'key[a].up': 0,
    'key[a].down': 1
});
export const RIGHT = CONTEXT.registerState('right', {
    'key[ArrowRight].up': 0,
    'key[ArrowRight].down': 1,
    'key[d].up': 0,
    'key[d].down': 1
});
export const ZOOM_IN = CONTEXT.registerState('zoomin', {
    'key[z].up': 0,
    'key[z].down': 1
});
export const ZOOM_OUT = CONTEXT.registerState('zoomout', {
    'key[x].up': 0,
    'key[x].down': 1
});
export const ROLL_LEFT = CONTEXT.registerState('rollleft', {
    'key[q].up': 0,
    'key[q].down': 1
});
export const ROLL_RIGHT = CONTEXT.registerState('rollright', {
    'key[e].up': 0,
    'key[e].down': 1
});

export function doCameraMove(camera, moveSpeed = 6, zoomSpeed = 0.02, rotSpeed = 0.01)
{
    const xControl = RIGHT.value - LEFT.value;
    const yControl = DOWN.value - UP.value;
    const zoomControl = ZOOM_OUT.value - ZOOM_IN.value; 
    const rollControl = ROLL_RIGHT.value - ROLL_LEFT.value;

    // let roll = rollControl * rotSpeed;
    // camera.transform.rotation += roll;

    let scale = (zoomControl * zoomSpeed) + 1;
    let scaleX = camera.transform.scaleX * scale;
    let scaleY = camera.transform.scaleY * scale;
    camera.transform.setScale(scaleX, scaleY);

    let moveX = (xControl * moveSpeed) / scaleX;
    let moveY = (yControl * moveSpeed) / scaleY;
    camera.transform.x += moveX;
    camera.transform.y += moveY;
}
