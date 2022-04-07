
export default interface IRoll {
  dice: number[];
  results: number[];
  modifiers: number[];
  total: number;
  description?: string | undefined;
  valueOf: () => number;
}
