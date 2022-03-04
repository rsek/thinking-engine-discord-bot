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
    if (i == (strings.length - 1)) {
      joinedStrings.push(builtString);
    }
  }
  return joinedStrings;
}