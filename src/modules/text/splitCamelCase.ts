import { TypedRegEx } from "typed-regex";


export default function splitCamelCase(str: string) {
  const camelPattern = new RegExp(/([a-z])([A-Z])/, "g");
  const newStr = str.replaceAll(camelPattern, "$1 $2");
  return newStr;
}