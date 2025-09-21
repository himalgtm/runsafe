// No-op auth for hackathon. Everything is public.
export const requireAuth = (_req, _res, next) => next();
export const maybeAuth   = (_req, _res, next) => next();
export default { requireAuth, maybeAuth };
