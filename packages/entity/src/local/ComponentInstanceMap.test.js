import { ComponentInstanceMap } from './ComponentInstanceMap';

class ExampleComponent {
  x = 0;
}

export async function test() {
  defaultCase();
  initCase();
  exceedMaxCapacity();
}

function initCase() {
  assertThrows(() => new ComponentInstanceMap(ExampleComponent, 1, 0), "should throw if initial is greater than max capacity");
  assertThrows(() => new ComponentInstanceMap(ExampleComponent, 0, -1), "should throw if max is negative");
  assertThrows(() => new ComponentInstanceMap(ExampleComponent, 0, 0), "should throw if max is zero");
}

function exceedMaxCapacity() {
  let target = new ComponentInstanceMap(ExampleComponent, 0, 10);
  assertEquals(target.maxCapacity, 10);
  assertEquals(target.capacity, 0);

  target.insert(1);
  assertEquals(target.capacity, 1);
  target.insert(2);
  assertEquals(target.capacity, 2);
  target.insert(3);
  assertEquals(target.capacity, 4);
  target.insert(4);
  assertEquals(target.capacity, 8);
  target.insert(5);
  assertEquals(target.capacity, 8);
  target.insert(6);
  assertEquals(target.capacity, 8);
  target.insert(7);
  assertEquals(target.capacity, 8);
  target.insert(8);
  assertEquals(target.capacity, 10);
  target.insert(9);
  assertEquals(target.capacity, 10);
  target.insert(10);
  assertEquals(target.capacity, 10);

  assertThrows(() => target.insert(11), 'should not insert over max capacity');

  for(let i = 1; i <= 10; ++i) {
    target.delete(i);
  }
  assertEquals(target.size, 0, "should have deleted everything");
  assertEquals(target.capacity, 10, "should not change capacity after deletion");
}

function defaultCase() {
  let target = new ComponentInstanceMap(ExampleComponent);
  assertEquals(target.size, 0, 'should be empty on default new');
  assertGreaterThan(target.maxCapacity, 1);
  assertEquals(target.keys().length, 0, 'should have no keys');
  assertEquals(target.values().length, 0, 'should have no values');
  assertNotTrue(target.delete(0), 'should fail deleting');
  assertEquals(
    target.componentClass,
    ExampleComponent,
    'should have the same component class'
  );

  let first = target.insert(1);
  assertNotNullish(first, 'should insert successfully');
  first.x = 1;
  assertEquals(target.size, 1, 'should be have 1 item');
  assertTrue(target.has(1), 'should have inserted entity');
  assertEquals(target.keys().length, 1, 'should have 1 key');
  assertEquals(target.values().length, 1, 'should have 1 value');
  assertInOrder(target.keys(), [1], 'should have inserted entity id');
  assertInOrder(
    target.values(),
    [first],
    'should have inserted component instance'
  );
  assertEquals(
    target.lookup(1),
    first,
    'should be the same component instance on lookup'
  );
  assertNotTrue(target.delete(0), 'should delete nothing');

  let second = target.insert(2);
  assertNotNullish(second, 'should insert successfully');
  second.x = 2;
  assertEquals(target.size, 2, 'should be have 2 items');
  assertTrue(target.has(2), 'should have inserted entity');
  assertEquals(target.keys().length, 2, 'should have 2 keys');
  assertEquals(target.values().length, 2, 'should have 2 values');
  assertInOrder(target.keys(), [1, 2], 'should have all inserted entity ids');
  assertInOrder(
    target.values(),
    [first, second],
    'should have all inserted component instance'
  );
  assertEquals(
    target.lookup(2),
    second,
    'should be the same component instance on lookup'
  );

  let result = target.delete(1);
  assertTrue(result, 'should delete successfully');
  assertEquals(target.size, 1, 'should be have 1 item again');
  assertNotTrue(target.has(1), 'should NOT have deleted entity');
  assertInOrder(target.keys(), [2], 'should only have non-deleted entity id');
  assertInOrder(
    target.values(),
    [second],
    'should only have non-deleted component instance'
  );
  // NOTE: Lookups are not PROTECTED without has() check.
  // assertNullish(target.lookup(1), 'should be null when looking up deleted entity');
  // assertNotEquals(target.lookup(1), target.lookup(2), 'should not lookup to the same deleted instance');
}

/**
 * @param {() => any} thrower
 * @param {string} [message]
 */
function assertThrows(thrower, message) {
  let error = null;
  try {
    thrower();
  } catch (e) {
    error = e;
  }
  assertNotNullish(
    error,
    message ?? format('expected to throw an error, but error was', error)
  );
}

/**
 * @param {Iterable<any>} actual
 * @param {Iterable<any>} expected
 * @param {string} [message]
 */
function assertInOrder(actual, expected, message) {
  let actualArray = Array.from(actual);
  let expectedArray = Array.from(expected);
  assertEquals(
    actualArray.length,
    expectedArray.length,
    format(
      'expected the same length of',
      expectedArray.length,
      'but was',
      actualArray.length
    )
  );
  for (let i = 0; i < actualArray.length; ++i) {
    assertEquals(actualArray[i], expectedArray[i], message);
  }
}

/**
 * @param {number} actual
 * @param {number} min
 * @param {string} [message]
 */
function assertGreaterThan(actual, min, message) {
  assertTrue(actual >= min, message ?? format('should be greater than', min));
}


/**
 * @param {any} actual
 * @param {string} [message]
 */
function assertNullish(actual, message) {
  assertTrue(
    (actual ?? null) === null,
    message ?? format('expected nullish but was', actual)
  );
}

/**
 * @param {any} actual
 * @param {string} [message]
 */
function assertNotNullish(actual, message) {
  assertTrue(
    (actual ?? null) !== null,
    message ?? format('expected NOT nullish but was', actual)
  );
}

/**
 * @template T
 * @param {T} actual
 * @param {T} expected
 * @param {string} [message]
 */
function assertEquals(actual, expected, message) {
  assertTrue(
    actual === expected,
    message ?? format('expected', expected, 'but was', actual)
  );
}

/**
 * @template T
 * @param {T} actual
 * @param {T} expected
 * @param {string} [message]
 */
function assertNotEquals(actual, expected, message) {
  assertTrue(
    actual !== expected,
    message ?? format('expected to be not', expected, 'but was', actual)
  );
}

/**
 * @param {boolean} condition
 * @param {string} [message]
 */
function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message ?? format('expected true but was false'));
  }
}

/**
 * @param {boolean} condition
 * @param {string} [message]
 */
function assertNotTrue(condition, message) {
  if (condition) {
    throw new Error(message ?? format('expected false but was true'));
  }
}

/**
 * @param {...any} messages
 * @returns {string}
 */
function format(...messages) {
  return messages
    .map((part) => (typeof part === 'string' ? part : JSON.stringify(part)))
    .join(' ');
}
