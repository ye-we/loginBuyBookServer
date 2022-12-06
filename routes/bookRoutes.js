const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, bookController.getAllBooks)
  .post(bookController.newBook);
router.post("/buy/:bookId", authController.protect, bookController.buyBook);
router.get("/verifyPayment", bookController.verifyPayment);

module.exports = router;
