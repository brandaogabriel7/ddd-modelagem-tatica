import Address from './address';

describe('Customer address unit tests', () => {
  it('should throw an error when street is empty', () => {
    expect(() => {
      new Address(
        '',
        8,
        '12345-678',
        'Industrial São Luiz',
        'Betim',
        'Minas Gerais',
      );
    }).toThrow('Street is required');
  });

  it('should throw an error when city is empty', () => {
    expect(() => {
      new Address(
        'Rua dos Jacarés',
        8,
        '12345-678',
        'Industrial São Luiz',
        '',
        'Minas Gerais',
      );
    }).toThrow('City is required');
  });

  it('should throw an error when state is empty', () => {
    expect(() => {
      new Address(
        'Rua dos Jacarés',
        8,
        '12345-678',
        'Industrial São Luiz',
        'Betim',
        '',
      );
    }).toThrow('State is required');
  });

  it('should throw an error when zip code is empty', () => {
    expect(() => {
      new Address(
        'Rua dos Jacarés',
        8,
        '',
        'Industrial São Luiz',
        'Betim',
        'Minas Gerais',
      );
    }).toThrow('Zip code is required');
  });

  it('should throw an error when address number is less than or equal to 0', () => {
    expect(() => {
      new Address(
        'Rua dos Jacarés',
        0,
        '12345-678',
        'Industrial São Luiz',
        'Betim',
        'Minas Gerais',
      );
    }).toThrow('Number must be greater than 0');

    expect(() => {
      new Address(
        'Rua dos Jacarés',
        -3,
        '12345-678',
        'Industrial São Luiz',
        'Betim',
        'Minas Gerais',
      );
    }).toThrow('Number must be greater than 0');
  });

  it('should throw an error when neighborhood is empty', () => {
    expect(() => {
      new Address(
        'Rua dos Jacarés',
        8,
        '12345-678',
        '',
        'Betim',
        'Minas Gerais',
      );
    }).toThrow('Neighborhood is required');
  });

  it('should return address as string', () => {
    const address = new Address(
      'Rua dos Jacarés',
      8,
      '12345-678',
      'Industrial São Luiz',
      'Betim',
      'Minas Gerais',
    );

    expect(address.toString()).toBe(
      'Rua dos Jacarés, 8, Industrial São Luiz, Betim, Minas Gerais, 12345-678',
    );
  });
});
