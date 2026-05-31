import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null

function getRedis() {
  if (!redis && process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN) {
    redis = new Redis({
      url: process.env.RATE_LIMIT_REDIS_URL,
      token: process.env.RATE_LIMIT_REDIS_TOKEN,
    })
  }
  return redis
}

// In-memory fallback for development/testing
const inMemoryStore = new Map<string, { count: number; reset: number }>()

async function checkInMemory(key: string, limit: number, windowMs: number): Promise<{ success: boolean; limit: number; remaining: number }> {
  const now = Date.now()
  const entry = inMemoryStore.get(key)
  if (!entry || entry.reset < now) {
    inMemoryStore.set(key, { count: 1, reset: now + windowMs })
    return { success: true, limit, remaining: limit - 1 }
  }
  entry.count++
  const remaining = Math.max(0, limit - entry.count)
  return { success: entry.count <= limit, limit, remaining }
}

export async function rateLimit(
  identifier: string,
  { limit, window: windowSeconds }: { limit: number; window: number }
): Promise<{ success: boolean; limit: number; remaining: number }> {
  const r = getRedis()
  if (!r) {
    return checkInMemory(identifier, limit, windowSeconds * 1000)
  }
  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds}s`),
  })
  const result = await limiter.limit(identifier)
  return { success: result.success, limit: result.limit, remaining: result.remaining }
}
