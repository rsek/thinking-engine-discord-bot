type WithRequired<T, K extends keyof T> = T & { [P in K]-?: NonNullable<T[P]> };

export default WithRequired;