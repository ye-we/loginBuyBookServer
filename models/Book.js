const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide the book title!"],
  },
  author: {
    type: String,
    required: [true, "Please provide the author"],
  },
  price: {
    type: Number,
    required: [true, "Please provide the price"],
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
