expect.extend({
    toEqualIgnoringNull(received, expected) {
      const removeNullFields = obj => {
        const newObj = { ...obj };
        Object.keys(newObj).forEach(key => newObj[key] === null && delete newObj[key]);
        return newObj;
      };
  
      const receivedWithoutNullFields = removeNullFields(received);
  
      if (this.equals(receivedWithoutNullFields, expected)) {
        return {
          message: () => `expected ${this.utils.printReceived(receivedWithoutNullFields)} not to equal ${this.utils.printExpected(expected)}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${this.utils.printReceived(receivedWithoutNullFields)} to equal ${this.utils.printExpected(expected)}`,
          pass: false,
        };
      }
    },
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