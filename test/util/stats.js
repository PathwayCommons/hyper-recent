import { difference, intersection } from './set.js';

function _precision (expected, actual) {
  const TP = intersection(expected, actual);
  const FP = difference(actual, expected);
  return TP.size / (FP.size + TP.size);
}

function _recall (expected, actual) {
  const TP = intersection(expected, actual);
  const FN = difference(actual, expected);
  return TP.size / (TP.size + FN.size);
}

/**
 * stats
 *
 * Return the performance metrics for binary class tasks
 *
 * @param {object} expected set of expected
 * @param {object} actual set of observed
 * @returns precision, recall, and Fscore for the sets
 */
export default function stats (expected, actual) {
  const precision = _precision(expected, actual);
  const recall = _recall(expected, actual);
  const F = 2 * precision * recall / (precision + recall);
  return { precision, recall, F };
}
