import { EntityId } from '../local';

/**
 * @template {Record<string, import('./MatchTypes').MatchClass<any>>} T
 * @param {T} template
 * @returns {import('./MatchTypes').Match<T>}
 */
export function createMatch(template) {
  /** @type {Array<import('./MatchTypes').MatchClass<any>>} */
  const all = [];
  /** @type {Array<import('./MatchTypes').MatchClass<any>>} */
  const any = [];
  /** @type {Array<import('./MatchTypes').MatchClass<any>>} */
  const none = [];
  /** @type {Array<import('./MatchTypes').MatchClass<any>>} */
  const maybe = [];

  for (let [_, value] of Object.entries(template)) {
    // TODO: For now, everything is AND'ed together.
    all.push(value);
  }

  if (all.length === 1 && all[0].name === EntityId.name) {
    throw new Error(
      'Cannot match only for EntityId, must include at least 1 other component class!'
    );
  }

  const matchId = matchIdFrom(all, any, none);
  return {
    matchId,
    template,
    all,
    any,
    none,
    maybe,
  };
}

/**
 * @param {Array<import('./MatchTypes').MatchClass<any>>} all
 * @param {Array<import('./MatchTypes').MatchClass<any>>} any
 * @param {Array<import('./MatchTypes').MatchClass<any>>} none
 */
function matchIdFrom(all, any, none) {
  return [
    ...all.map((c) => `&${c.name}`),
    ...any.map((c) => `|${c.name}`),
    ...none.map((c) => `~${c.name}`),
  ].sort().join('');
}
