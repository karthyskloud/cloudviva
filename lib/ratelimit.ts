const store = new Map<string, number[]>();

const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (store.get(ip) || []).filter(t => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = Math.min(...timestamps);
    const resetIn = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000 / 60);
    return { allowed: false, remaining: 0, resetIn };
  }

  timestamps.push(now);
  store.set(ip, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length, resetIn: 0 };
}
