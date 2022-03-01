import troikaDice from "./troikaDice.js";

type mods = `+${number}`|`-${number}`;
type troikaDiceNotation = `${number|""}d${troikaDice}${mods|""}`;

export default troikaDiceNotation;
