declare namespace jest {
    interface Matchers<R> {
      toEqualIgnoringNull(expected: any): R;
      toBeContainedEqual(expected: any): R;
    }
  }
  