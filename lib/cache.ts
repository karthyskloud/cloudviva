import crypto from "crypto";

interface CacheEntry {
  result: unknown;
  expires: number;
}

const store = new Map<string, CacheEntry>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

function hash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function getCached(content: string): unknown | null {
  const key = hash(content);
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.result;
}

export function setCache(content: string, result: unknown): void {
  const key = hash(content);
  store.set(key, { result, expires: Date.now() + TTL_MS });
}
