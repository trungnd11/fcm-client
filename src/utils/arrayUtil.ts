export function isEmptyArray<T>(arr: T[] | undefined | null): boolean {
  return !arr || arr.length === 0;
}
