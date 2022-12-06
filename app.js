const express = require("express");
const mongoose = require("mongoose");

const AppError = require("./utils/appError");
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRoutes");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// test middleware
app.use((req, res, next) => {
  // req.requestTime = new Date.toISOString();
  // console.log(req.cookies);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
// For non-existing routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
