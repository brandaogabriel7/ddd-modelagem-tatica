expect.extend({
    toBeContainedEqual(received, expected) {
      const receivedKeys = Object.keys(received);
      const expectedKeys = Object.keys(expected);
    
      if (expectedKeys.every(key => receivedKeys.includes(key) && received[key] === expected[key])) {
        return {
          message: () => `expected ${this.utils.printReceived(received)} not to contain ${this.utils.printExpected(expected)}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${this.utils.printReceived(received)} to contain ${this.utils.printExpected(expected)}`,
          pass: false,
        };
      }
    }
  });