const TOP_INDEX = 0;

// NOTE: Uses a binary heap to sort.
/**
 * @template T
 */
export class PriorityQueue {
  /**
   * @param {(a: T, b: T) => number} comparator
   */
  constructor(comparator) {
    /** @private */
    this._heap = [];
    /** @private */
    this._comparator = comparator;
  }

  get size() {
    return this._heap.length;
  }

  clear() {
    this._heap.length = 0;
  }

  /**
   * @param {...T} values
   */
  push(...values) {
    for (let value of values) {
      this._heap.push(value);
      this._shiftUp();
    }
  }

  /**
   * @returns {T}
   */
  pop() {
    const result = this.peek();
    let bottom = bottomIndex(this);
    if (bottom > TOP_INDEX) {
      this._swap(TOP_INDEX, bottom);
    }
    this._heap.pop();
    this._shiftDown();
    return result;
  }

  /**
   * Replaces the top value with the new value.
   * @param {T} value
   * @returns {T}
   */
  replace(value) {
    const result = this.peek();
    this._heap[TOP_INDEX] = value;
    this._shiftDown();
    return result;
  }

  /**
   * @returns {T}
   */
  peek() {
    return this._heap[TOP_INDEX];
  }

  /**
   * @param {number} index
   * @returns {T}
   */
  at(index) {
    return this._heap[index];
  }

  /**
   * @param {T} value
   * @param {number} [fromIndex]
   */
  indexOf(value, fromIndex = undefined) {
    return this._heap.indexOf(value, fromIndex);
  }

  /**
   * @param {number} start
   * @param {number} [deleteCount]
   * @returns {Array<T>}
   */
  splice(start, deleteCount = undefined) {
    return this._heap.splice(start, deleteCount);
  }

  /** @private */
  _compare(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  /** @private */
  _swap(i, j) {
    let result = this._heap[i];
    this._heap[i] = this._heap[j];
    this._heap[j] = result;
  }

  /** @private */
  _shiftUp() {
    let node = this._heap.length - 1;
    let nodeParent;
    while (
      node > TOP_INDEX &&
      this._compare(node, (nodeParent = parentIndex(node)))
    ) {
      this._swap(node, nodeParent);
      node = nodeParent;
    }
  }

  /** @private */
  _shiftDown() {
    const length = this._heap.length;
    let node = TOP_INDEX;
    let nodeMax;

    let nodeLeft = leftIndex(node);
    let flagLeft = nodeLeft < length;
    let nodeRight = rightIndex(node);
    let flagRight = nodeRight < length;

    while (
      (flagLeft && this._compare(nodeLeft, node)) ||
      (flagRight && this._compare(nodeRight, node))
    ) {
      nodeMax =
        flagRight && this._compare(nodeRight, nodeLeft) ? nodeRight : nodeLeft;
      this._swap(node, nodeMax);
      node = nodeMax;

      nodeLeft = leftIndex(node);
      flagLeft = nodeLeft < length;
      nodeRight = rightIndex(node);
      flagRight = nodeRight < length;
    }
  }

  /** @returns {Array<T>} */
  values() {
    return this._heap;
  }

  /** @returns {Iterator<T>} */
  [Symbol.iterator]() {
    return this._heap[Symbol.iterator]();
  }
}

function bottomIndex(queue) {
  return queue._heap.length - 1;
}

function parentIndex(i) {
  return ((i + 1) >>> 1) - 1;
}

function leftIndex(i) {
  return (i << 1) + 1;
}

function rightIndex(i) {
  return (i + 1) << 1;
}
