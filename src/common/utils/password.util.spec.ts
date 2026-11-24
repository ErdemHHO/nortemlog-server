import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.util.js';

describe('password.util', () => {
  it('hashes a password and verifies it successfully', async () => {
    const plain = 'StrongPass123!';
    const hashed = await hashPassword(plain);

    expect(hashed).toContain(':');
    await expect(verifyPassword(plain, hashed)).resolves.toBe(true);
  });

  it('returns false when password does not match hash', async () => {
    const hashed = await hashPassword('StrongPass123!');

    await expect(verifyPassword('WrongPassword!', hashed)).resolves.toBe(false);
  });

  it('returns false when stored hash is undefined or malformed', async () => {
    await expect(verifyPassword('StrongPass123!', undefined)).resolves.toBe(
      false,
    );
    await expect(
      verifyPassword('StrongPass123!', 'malformed_hash'),
    ).resolves.toBe(false);
  });
});
