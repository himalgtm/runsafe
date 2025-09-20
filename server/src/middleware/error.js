export function errorMw(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({ error: { code: err.code || 'INTERNAL', message: err.message || 'Server error' } });
}