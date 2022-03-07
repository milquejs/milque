export async function loadSystems(world, systems) {
  for (let system of systems) {
    if ('load' in system) {
      await system.load(world);
    }
  }
}

export function initializeSystems(world, systems) {
  for (let system of systems) {
    if ('initialize' in system) {
      system.initialize(world);
    }
  }
}

export function updateSystems(world, dt, systems) {
  for (let system of systems) {
    if ('update' in system) {
      system.update(world, dt);
    }
  }
}

export function renderSystems(world, ctx, systems) {
  for (let system of systems) {
    if ('render' in system) {
      system.render(world, ctx);
    }
  }
}
