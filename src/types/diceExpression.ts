import _ from "lodash";
import { TypedRegEx } from "typed-regex";

type diceExpression = `${number|""}d${number}` | `${number|""}d${number}${plusOrMinus}${number}`;

type plusOrMinus = "+" | "-";

export default diceExpression;

const dicePattern = TypedRegEx("(?<quantity>[1-9][0-9]*)?d(?<sides>[2-9][0-9]*)(?<modifier>[\\+-][0-9]+)?", "i");

export { dicePattern };

