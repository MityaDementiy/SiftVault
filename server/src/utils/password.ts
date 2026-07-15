import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> => (
  bcrypt.hash(password, SALT_ROUNDS)
);

export const verifyPassword = (
  password: string,
  passwordHash: string,
): Promise<boolean> => bcrypt.compare(password, passwordHash);

// NOTE: keeps failed-login timing constant regardless of whether the email exists
export const DUMMY_PASSWORD_HASH = bcrypt.hashSync('dummy-password-for-timing-safety', SALT_ROUNDS);
