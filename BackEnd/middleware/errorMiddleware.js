// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error for dev
  console.error(err.stack.red);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler };
