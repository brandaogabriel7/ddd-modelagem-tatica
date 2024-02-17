declare namespace jest {
    interface Matchers<R> {
      toEqualIgnoringNull(expected: any): R;
    }
  }
  