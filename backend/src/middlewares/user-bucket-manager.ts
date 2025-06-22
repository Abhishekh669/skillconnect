import { TokenBucket } from "./token-bucket";

export class UserBucketManager {
  private buckets: Map<string, TokenBucket>;
  private defaultCapacity: number;
  private refillRate: number;
  private cleanUpInterval: number;
  private staleMultiplier: number;
  private maxBuckets: number;
  private currentBuckets: number;
  private cleanupIntervalId?: NodeJS.Timeout;

  constructor(
    defaultCapacity: number,
    refillRate: number,
    cleanUpInterval: number,
    staleMultiplier: number,
    maxBuckets: number
  ) {
    this.buckets = new Map();
    this.defaultCapacity = defaultCapacity;
    this.refillRate = refillRate;
    this.cleanUpInterval = cleanUpInterval;
    this.staleMultiplier = staleMultiplier;
    this.maxBuckets = maxBuckets;
    this.currentBuckets = 0;
    this.startCleanup();
  }

  private startCleanup(): void {
    this.cleanupIntervalId = setInterval(() => {
      const now = Date.now();
      const staleThreshold = this.cleanUpInterval * this.staleMultiplier;

      for (const [userId, bucket] of this.buckets.entries()) {
        if (now - bucket.lastRefill > staleThreshold) {
          this.buckets.delete(userId);
          this.currentBuckets--;
          console.log(`Deleted stale bucket for ${userId}`);
        }
      }
    }, this.cleanUpInterval);
  }

  getBucket(userId: string): TokenBucket | null {
    const existingBucket = this.buckets.get(userId);
    if (existingBucket) return existingBucket;

    // Don't create new bucket if we've reached max
    if (this.currentBuckets >= this.maxBuckets) {
      console.warn("Maximum number of buckets reached");
      return null;
    }

    // Create new bucket
    const newBucket = new TokenBucket(this.defaultCapacity, this.refillRate);
    this.buckets.set(userId, newBucket);
    this.currentBuckets++;
    console.log(`Created new bucket for ${userId}`);
    console.log(`Total buckets: ${this.currentBuckets}, Available: ${this.maxBuckets - this.currentBuckets}`);

    return newBucket;
  }

  allowRequest(userId: string): boolean {
    const bucket = this.getBucket(userId);
    return bucket?.allow() ?? false;
  }

  stop(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }
    this.buckets.clear();
    this.currentBuckets = 0;
  }
}