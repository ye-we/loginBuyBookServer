const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = () => {
  const message = "Your token has expired, please log in again.";
  return new AppError(message, 400);
};
const handleJsonWebTokenError = (err) => {
  const message = err.message;
  return new AppError(message, 400);
};

const handleChapaDetailsError = (err) => {
  const message = JSON.stringify(err.response.data.message);
  return new AppError(message, 400);
};

const handleChapaConnectionError = () => {
  const message =
    "Connection to Chapa failed, please check your connection and try again";
  return new AppError(message, 400);
};

const sendError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") err = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError(err);
  if (err.name === "TokenExpiredError") err = handleTokenExpiredError();
  else if (err.code === "ERR_BAD_REQUEST") err = handleChapaDetailsError(err);
  else if (err.code === "ENOTFOUND") err = handleChapaConnectionError();
  sendError(err, res);
};
