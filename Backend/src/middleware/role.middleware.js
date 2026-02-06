export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user.roles.some(r => roles.includes(r))) {
            return res.sendStatus(403);
        }
        next();
    };
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.roles ||
      !req.user.roles.some(role => allowedRoles.includes(role))
    ) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission"
      });
    }

    next();
  };
};

