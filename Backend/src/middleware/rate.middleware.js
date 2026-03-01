import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req, res) => {
    if (req.body.email) {
      return `email:${req.body.email.toLowerCase().trim()}`;
    }
    return ipKeyGenerator(req, res);
  },
  message: {
    message: 'Too many password reset attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});