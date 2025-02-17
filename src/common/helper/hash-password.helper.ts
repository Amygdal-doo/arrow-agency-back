import { pbkdf2Sync, randomBytes } from 'crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex'); // Generate a salt
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex'); // Hash the password
  return `${salt}:${hash}`; // Combine salt and hash
}

export function verifyPassword(
  storedPassword: string,
  inputPassword: string,
): boolean {
  const [salt, originalHash] = storedPassword.split(':'); // Extract salt and hash

  const hash = pbkdf2Sync(inputPassword, salt, 100000, 64, 'sha512').toString(
    'hex',
  ); // Hash input password
  return hash === originalHash; // Compare hashes
}
