const sum = require('./sum');

test('Check if 2+2 = 4', () => {
    expect(sum(2,2)).toBe(4);
});