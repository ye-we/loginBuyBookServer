const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get(
  "/getLoggedInUser",
  authController.isLoggedIn,
  authController.getLoggedInUser
);

module.exports = router;
