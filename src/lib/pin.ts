import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPin(pin: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return { hash, salt };
}

export function verifyPin(pin: string, hash: string, salt: string): boolean {
  let stored: Buffer;
  try {
    stored = Buffer.from(hash, "hex");
  } catch {
    return false;
  }
  const candidate = scryptSync(pin, salt, 32);
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
}
