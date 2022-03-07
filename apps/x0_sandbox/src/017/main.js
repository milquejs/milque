import { Input, GameInterface } from './milque.js';
import * as GameObjectFactory from './GameObjectFactory.js';
import * as Box from './Box.js';

const MOUSE_X = Input.createRange('mouse[pos].x');
const MOUSE_Y = Input.createRange('mouse[pos].y');
const MOUSE_DOWN = Input.createAction('mouse[0].down');
const MOUSE_UP = Input.createAction('mouse[0].up');

/*
Ship
- Room List
- Hull
- Shields
Rooms
- Energy
- Max Energy
- Hull
- Oxygen
- Surveil
- Crew Slots
- Fuel
- Components
System Rooms
- Med Bay
    - Heal Speed
- Command Center
    - Communications
    - Power Management
- Engine
    - Thruster Slots
- Weapons
    - Weapon Slots
- Cameras
    - Room Slots (within radius)
- Scanner
    - See other ship's rooms
- Shields
    - Generates shields
*/

const Room = GameObjectFactory.createFactory(() =>
  Box.create(0, 0, {
    width: 64,
    height: 64,
    text: 'Room',
    show: false,
  })
);

const Crew = GameObjectFactory.createFactory(() =>
  Box.create(16, 16, {
    width: 32,
    height: 32,
    color: 'gray',
    text: 'Joe',
  })
);

export function start() {
  Room.create().setRect(0, 0);
  Room.create().setRect(0, 64 + 2);
  Room.create().setRect(0, 128 + 4);
  Room.create().setRect(0, 194 + 4);

  Crew.create();

  this.selectTarget = null;

  this.mouse = Box.create(0, 0, { width: 1, height: 1, color: 'red' });
}

export function update(dt) {
  Input.poll();

  let view = GameInterface.getGameInfo(this).view;
  this.mouse.x = MOUSE_X.value * view.width;
  this.mouse.y = MOUSE_Y.value * view.height;

  for (let room of Room.objects) {
    if (Box.intersects(this.mouse, room)) {
      room.color = 'gray';
      room.show = true;
    } else {
      room.color = 'white';
      room.show = false;
    }
  }

  if (MOUSE_DOWN.value) {
    let target = null;
    for (let crew of Crew.objects) {
      if (Box.intersects(this.mouse, crew)) {
        target = crew;
      }
    }

    if (target) this.selectTarget = target;
  } else if (MOUSE_UP.value) {
    this.selectTarget = null;
  }

  if (this.selectTarget) {
    this.selectTarget.x = this.mouse.x;
    this.selectTarget.y = this.mouse.y;
  }
}

export function render(view) {
  let ctx = view.context;
  Box.render(view);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, view.height - 100, view.width, view.height);
  ctx.fillStyle = 'blue';
  for (let room of Room.objects) {
    if (room.show) {
      ctx.fillText('Energy: [|||...]', 0, view.height - 8);
      ctx.fillText('Fuel: [|||...]', 0, view.height - 24);
      ctx.fillText('Hull: [|||...]', 0, view.height - 40);
      ctx.fillText('Power: ON', 0, view.height - 56);
      ctx.fillText('Surveil: ON', 0, view.height - 72);
      ctx.fillText('Locked: OFF', 0, view.height - 88);
      break;
    }
  }
}
