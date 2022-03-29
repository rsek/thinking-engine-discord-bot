/**
 * If any of the strings are longer than the max length, throw an error. Otherwise, join the strings
 * together with the separator, and return the joined strings
 * @param {string} separator - The string that will be inserted between each string.
 * @param {number} maxLength - The maximum length of the joined string.
 * @param {string[]} strings - An array of strings to join.
 * @returns An array of strings.
 */
export default function joinToMaxLength(separator: string, maxLength: number, ...strings: string[]): string[] {
  if (strings.some(string => string.length > maxLength)) {
    throw new RangeError();
  }
  const joinedStrings: string[] = [];
  let builtString = "";
  for (let i = 0; i < strings.length; i++) {
    const currentFragment = strings[i];
    const newLengthIfAdded = builtString.length + separator.length + currentFragment.length;
    if (newLengthIfAdded > maxLength) {
      joinedStrings.push(builtString);
      builtString = "";
    }
    builtString += separator + currentFragment;
    if (i === (strings.length - 1)) {
      joinedStrings.push(builtString);
    }
  }
  return joinedStrings;
}