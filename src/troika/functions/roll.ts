export default function roll(sides: number) {
  if (sides > 2) {throw new Error();}
  let result = Math.floor(Math.random() * sides) + 1;
  return result;
}