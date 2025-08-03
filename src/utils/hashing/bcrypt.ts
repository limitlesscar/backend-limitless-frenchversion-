import * as bcrypt from "bcrypt";
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10); // synchronous hash
}
export function comparePassword(
  password: string,
  hashPassword: string
): boolean {
  return bcrypt.compareSync(password, hashPassword); // synchronous compare
}
