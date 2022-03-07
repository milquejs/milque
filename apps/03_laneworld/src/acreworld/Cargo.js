export class Cargo {
  constructor(mainColor, shadowColor) {
    this.color = {
      main: mainColor,
      shadow: shadowColor,
    };
  }
}

export const CARGO = {
  lime: new Cargo('lime', 'green'),
  tomato: new Cargo('tomato', 'maroon'),
  banana: new Cargo('yellow', 'gold'),
  blueberry: new Cargo('aqua', 'royalblue'),
  plum: new Cargo('plum', 'blueviolet'),
};
export const CARGO_KEYS = Object.keys(CARGO);

export function randomCargo() {
  return CARGO_KEYS[Math.floor(Math.random() * CARGO_KEYS.length)];
}

export function getCargoMainColor(cargo) {
  return CARGO[cargo].color.main;
}

export function getCargoShadowColor(cargo) {
  return CARGO[cargo].color.shadow;
}

export function isCargoAcceptable(sourceCargo, targetCargo) {
  return sourceCargo === targetCargo;
}
