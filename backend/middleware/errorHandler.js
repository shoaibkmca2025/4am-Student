const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = Number.isInteger(err?.status) ? err.status : 500;
  let message = err?.message || 'Server error';
  let details;

  if (err?.name === 'CastError') {
    status = 400;
    message = 'Invalid request data';
  } else if (err?.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([key, value]) => [key, value?.message || 'Invalid value'])
    );
  } else if (err?.code === 11000) {
    status = 409;
    message = 'Duplicate value already exists';
  }

  if (status >= 500) {
    console.error(err.stack || err);
  }

  return res.status(status).json({
    message,
    details,
    ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {})
  });
};

export default errorHandler;
