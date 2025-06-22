export interface RateLimiterOptions {
  /** 
   * Maximum number of tokens the bucket can hold
   * @default 10
   */
  capacity: number;
  
  /** 
   * How many tokens are refilled per second 
   * @default 1
   */
  refillRate: number;
  
  /** 
   * How often to check for stale buckets (in milliseconds)
   * @default 60000 (1 minute)
   */
  cleanUpInterval: number;
  
  /** 
   * Multiplier for determining when a bucket is stale
   * (cleanUpInterval * staleMultiplier = stale threshold)
   * @default 2
   */
  staleMultiplier: number;
  
  /** 
   * Maximum number of buckets to create (prevents memory leaks)
   * @default 1000
   */
  maxBuckets: number;
}