const pkmnTypeService = require('../services/pkmnType.service');

describe('PkmnType Service', () => {

  test('should return an array', () => {
    const result = pkmnTypeService.getAllTypes();
    expect(Array.isArray(result)).toBe(true);
  });

  test('should not return an empty array', () => {
    const result = pkmnTypeService.getAllTypes();
    expect(result.length).toBeGreaterThan(0);
  });

  test('should return only strings', () => {
    const result = pkmnTypeService.getAllTypes();
    const allStrings = result.every(type => typeof type === 'string');
    expect(allStrings).toBe(true);
  });

  test('should contain FIRE type', () => {
    const result = pkmnTypeService.getAllTypes();
    expect(result).toContain('FIRE');
  });

});