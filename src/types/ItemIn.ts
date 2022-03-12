type ItemIn<T> = T extends (infer U)[] ? U : T;

// Array<string>[number]

export default ItemIn;