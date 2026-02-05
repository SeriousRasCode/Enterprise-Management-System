import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.sendStatus(403);
    }
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("USER:", req.user);
};
