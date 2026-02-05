export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user.roles.some(r => roles.includes(r))) {
            return res.sendStatus(403);
        }
        next();
    };
};
