import { greeting } from './greeting';

describe('greeting', () => {
  it('should return greeting message with name', () => {
    expect(greeting('Sam')).toBe('Hello, Sam!');
  });

  it('should return greeting message with default name', () => {
    expect(greeting()).toBe('Hello, World!');
  });
});
