import { TypedRegEx } from "typed-regex";


/**
 * Split a camelCase string into words, where each word is separated by a space
 * @param {string} str - The string to be split.
 * @returns The string with the camel case replaced with spaces.
 */
export default function splitCamelCase(str: string) {
  const camelPattern = new RegExp(/([a-z])([A-Z])/, "g");
  const newStr = str.replaceAll(camelPattern, "$1 $2");
  return newStr;
}