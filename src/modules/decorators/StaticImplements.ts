// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function StaticImplements<T>() {
  return (constructor: T) => { /* nop */ };
}