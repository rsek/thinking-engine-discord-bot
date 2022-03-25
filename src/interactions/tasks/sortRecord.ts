/**
 *
 * @param record The record object to be sorted.
 * @param func The function to sort with
 * @returns the sorted object
 */
export default function sortRecord<T extends Record<string, unknown>>(record: T, func: (a: [string, unknown], b: [string, unknown]) => number): T {
  return Object.fromEntries(Object.entries(record).sort((entryA, entryB) => func(entryA, entryB))) as T;
}