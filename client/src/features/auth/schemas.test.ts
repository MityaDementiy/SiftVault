import { describe, expect, it } from 'vitest';

import { registerSchema, loginSchema } from './schemas';

const VALID_REGISTER_INPUT = {
  email: 'user@example.com',
  username: 'valid_user',
  password: 'password123',
};

describe('registerSchema', () => {
  it('accepts a valid registration payload', () => {
    expect(registerSchema.safeParse(VALID_REGISTER_INPUT).success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = registerSchema.safeParse({ ...VALID_REGISTER_INPUT, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it.each([
    ['ab', false],
    ['abc', true],
    ['a'.repeat(32), true],
    ['a'.repeat(33), false],
  ])('username of length from %j is valid: %s', (username, expectedValid) => {
    const result = registerSchema.safeParse({ ...VALID_REGISTER_INPUT, username });
    expect(result.success).toBe(expectedValid);
  });

  it('rejects usernames with invalid characters', () => {
    const result = registerSchema.safeParse({ ...VALID_REGISTER_INPUT, username: 'invalid user!' });
    expect(result.success).toBe(false);
  });

  it.each([
    ['1234567', false],
    ['12345678', true],
  ])('password %j is valid: %s', (password, expectedValid) => {
    const result = registerSchema.safeParse({ ...VALID_REGISTER_INPUT, password });
    expect(result.success).toBe(expectedValid);
  });
});

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'anything' });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'nope', password: 'anything' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});
