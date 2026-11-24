import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { PASSWORD_HASH_CONSTANTS } from '../constants/crypto.constants.js';

function deriveScryptKey(
  password: string,
  salt: string,
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_HASH_CONSTANTS.SALT_BYTES).toString(
    PASSWORD_HASH_CONSTANTS.ENCODING,
  );
  const derivedKey = await deriveScryptKey(
    password,
    salt,
    PASSWORD_HASH_CONSTANTS.KEY_LENGTH,
  );

  return `${salt}${PASSWORD_HASH_CONSTANTS.SEPARATOR}${derivedKey.toString(PASSWORD_HASH_CONSTANTS.ENCODING)}`;
}

export async function verifyPassword(
  password: string,
  storedHash?: string | null,
): Promise<boolean> {
  if (!storedHash) {
    await deriveScryptKey(
      password,
      PASSWORD_HASH_CONSTANTS.DUMMY_SALT,
      PASSWORD_HASH_CONSTANTS.KEY_LENGTH,
    );
    return false;
  }

  const [salt, keyHex] = storedHash.split(PASSWORD_HASH_CONSTANTS.SEPARATOR);

  if (!salt || !keyHex) {
    await deriveScryptKey(
      password,
      PASSWORD_HASH_CONSTANTS.DUMMY_SALT,
      PASSWORD_HASH_CONSTANTS.KEY_LENGTH,
    );
    return false;
  }

  const keyBuffer = Buffer.from(keyHex, PASSWORD_HASH_CONSTANTS.ENCODING);
  const derivedKey = await deriveScryptKey(
    password,
    salt,
    PASSWORD_HASH_CONSTANTS.KEY_LENGTH,
  );

  if (keyBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(keyBuffer, derivedKey);
}
