// types/AuthRequest.ts or in your middleware file
import { Request } from "express";

export interface AuthRequest extends Request {
  userDataId?: string;
  userId?: string;
}
