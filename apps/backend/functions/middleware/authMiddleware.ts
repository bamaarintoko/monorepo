import { Request, Response, NextFunction } from 'express';
import { admin } from '../config/firebaseConfig';

/**
 * Auth middleware to verify Firebase ID token.
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        [key: string]: any;
    };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is provided and has Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided.' });
        return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Add user data to request for later use
        next(); // Pass to next middleware/controller
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};