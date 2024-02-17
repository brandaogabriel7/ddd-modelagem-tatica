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
  });