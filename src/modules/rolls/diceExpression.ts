import { TypedRegEx } from "typed-regex";

type DiceExpression = `${number|""}d${number}` | `${number}d${number}${plusOrMinus}${number}`;

type plusOrMinus = "+" | "-";

export default DiceExpression;

const dicePatternQuantityOptional = TypedRegEx("(?<quantity>[1-9][0-9]*)?d(?<sides>[2-9][0-9]*)(?<modifier>[\\+-][0-9]+)?", "gi");

const dicePattern = TypedRegEx("(?<quantity>[1-9][0-9]*)d(?<sides>[2-9][0-9]*)(?<modifier>[\\+-][0-9]+)?", "gi");

export { dicePattern, dicePatternQuantityOptional };

