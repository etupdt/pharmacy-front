import { Client } from './client';

describe('Auth', () => {
  it('should create an instance', () => {
    expect(new Client()).toBeTruthy();
  });
});
