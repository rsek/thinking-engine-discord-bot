
export default interface IRoll {
  results: number[];
  modifier: number;
  total: number;
  description?: string | undefined;
  valueOf: () => number;
}
