declare namespace jest {
  interface Matchers<R> {
    toBeContainedEqual(expected: any): R;
  }
}
