import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret-key', {
        expiresIn: '1d'
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
};
