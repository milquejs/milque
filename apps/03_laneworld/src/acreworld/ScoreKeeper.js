import { CARGO_KEYS } from './Cargo.js';

export class ScoreKeeper {
  constructor() {
    this.cargos = {};
    for (let cargo of CARGO_KEYS) {
      this.cargos[cargo] = 0;
    }
  }

  recordCargo(cargo, units) {
    let prev = this.cargos[cargo];
    this.cargos[cargo] = prev + units;
  }

  getCargoCount(cargo) {
    return this.cargos[cargo];
  }
}
