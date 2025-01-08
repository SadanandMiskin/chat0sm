import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Types } from 'mongoose';

interface JwtPayload {
  userId: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        req.user = { _id: user._id } as { _id: Types.ObjectId } | undefined;
        next();
      }
    }
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
};

export default auth;
