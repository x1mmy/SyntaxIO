// This is for JWT verification

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import {IUser} from '../models/User';

//Extend the Request interface to include the user property
declare global{
    namespace Express{
        interface Request{
            user?: IUser;
        }
    }
}

export const protect: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({ message: 'Unauthorized, no token provided' });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }

        const decoded = jwt.verify(token, secret) as { user: IUser };
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized, invalid token' });
        return;
    }
};



