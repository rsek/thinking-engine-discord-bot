/**
 * Changes the first character of a string to upper case.
 * @param text The text to be converted.
 * @returns The original text with the first character in upper case.
 */
export default function toSentenceCase(text: string) {
  const newText = text.slice(0, 1).toUpperCase() + text.slice(1);
  return newText;
}