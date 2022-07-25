/**
 * intersection
 *
 * @param {object} setA first set
 * @param {object} setB second set
 * @returns a set of the intersection
 */
export function intersection (setA, setB) {
  const _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

/**
 * symmetricDifference
 *
 * @param {object} setA first set
 * @param {object} setB second set
 * @returns a set of unique items
 */
export function symmetricDifference (setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

/**
 * difference
 *
 * @param {object} setA first set
 * @param {object} setB second set
 * @returns remove items in setB from setA
 */
export function difference (setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

/**
 * isSuperset
 *
 * @param {object} set first set
 * @param {object} subset second set
 * @returns true if subset of set
 */
export function isSuperset (set, subset) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}
