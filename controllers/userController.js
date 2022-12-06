const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
