type ValueOfMap<M> = M extends Map<unknown, infer V> ? V : never;

export default ValueOfMap;