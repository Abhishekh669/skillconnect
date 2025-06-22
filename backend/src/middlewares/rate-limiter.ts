import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserBucketManager } from './user-bucket-manager';
import { RateLimiterOptions } from '../lib/types/user-bucket-type';
// In rate-limiter.ts
export function createRateLimiter(options: RateLimiterOptions): RequestHandler {
  const {
    capacity = 10,
    refillRate = 1,
    cleanUpInterval = 60 * 1000,
    staleMultiplier = 2,
    maxBuckets = 1000,
  } = options;

  const manager = new UserBucketManager(
    capacity,
    refillRate,
    cleanUpInterval,
    staleMultiplier,
    maxBuckets
  );

    return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.ip || req.socket.remoteAddress;
    
    if (!userId) {
      res.status(400).json({ error: "Could not identify client" });
      return undefined as never; 
    }

    if (!manager.allowRequest(userId)) {
      res.status(429).json({ error: "Too many requests" });
      return undefined as never; 
    }

    next();
  };
}