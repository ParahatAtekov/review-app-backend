import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };

    // Double-check with Supabase (optional but safe)
    const { data: supabaseUser } = await supabase.auth.getUser(token);
    if (!supabaseUser.user) throw new Error('Invalid token');

    // Attach user to request
    req.user = { id: decoded.sub };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};