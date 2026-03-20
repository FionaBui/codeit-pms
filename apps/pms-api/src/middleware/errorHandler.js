export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Default to 500 unless a downstream layer sets statusCode
  const status = typeof err?.statusCode === 'number' ? err.statusCode : 500;
  const message =
    status >= 500 ? 'Internal server error' : err?.message ?? 'Request failed';

  res.status(status).json({
    error: {
      code: err?.code ?? 'error',
      message,
    },
  });
}

