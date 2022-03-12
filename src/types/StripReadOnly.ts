type StripReadOnly<T> ={-readonly [P in keyof T]: T[P]};

export default StripReadOnly;