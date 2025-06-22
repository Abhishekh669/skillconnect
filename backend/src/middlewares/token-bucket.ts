export class TokenBucket {
  private capacity: number;
  private tokens: number;
  private refillRate: number; // tokens per second
  public lastRefill: number; // timestamp in ms

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  allow(): boolean {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // in seconds
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
    
    if (this.tokens >= 1) {
      
      this.tokens--;
      console.log("token left : ", this.tokens)
      return true;
    }

    return false;
  }
}