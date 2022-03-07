import * as self from './EntityBuilder.js';

// Fluent Interface

export function begin() {}

export function build() {
  return;
}

const EntityBuilder = FluentBuilder.create(self);
export { EntityBuilder };
