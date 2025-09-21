export function errorMw(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({ error: { code: err.code || 'INTERNAL', message: err.message || 'Server error' } });
}

export function badRequest(res, message = 'Bad request') {
  return res.status(400).json({ error: { code: 'BAD_REQUEST', message } });
}

export function notFound(_req, res) {
  return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const code = err.code || (status === 400 ? 'BAD_REQUEST' : 'INTERNAL');
  const expose = status < 500;
  const message = expose ? (err.message || 'Error') : 'Internal server error';
  if (!expose) console.error('[ERROR]', err);
  res.status(status).json({ error: { code, message } });
}
