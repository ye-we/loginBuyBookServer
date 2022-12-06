const catchAsync = require("../utils/catchAsync");
const Book = require("../models/Book");
const axios = require("axios");

exports.newBook = catchAsync(async (req, res, next) => {
  const book = await Book.create({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
  });
  res.status(201).json({
    status: "success",
    message: "new book added",
    data: {
      book,
    },
  });
});

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
});

exports.buyBook = catchAsync(async (req, res, next) => {
  const user = req.user;
  const return_url = req.body.returnUrl;
  const first_name = user.name.split(" ")[0];
  const last_name = user.name.split(" ")[1];
  const book = await Book.findById(req.params.bookId);
  const tx_ref = "b-commerce" + Date.now();
  const transactionData = {
    amount: book.price,
    currency: "ETB",
    email: user.email,
    first_name,
    last_name,
    tx_ref,
    callback_url: `http://localhost:6000/api/books/verifyPayment`,
    return_url,
  };

  const response = await axios.post(
    "https://api.chapa.co/v1/transaction/initialize",
    {
      ...transactionData,
    },
    {
      headers: {
        "accept-encoding": "*", // this fixes the weird character encoding returned
        Authorization: `Bearer ${process.env.CHAPA_KEY}`,
      },
    }
  );
  const data = response.data;
  // console.log(response);
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const response = await axios.get(
    "https://api.chapa.co/v1/transaction/verify/" + req.query.tx_ref,
    {
      headers: {
        "accept-encoding": "*",
        Authorization: `Bearer ${process.env.CHAPA_KEY}`,
      },
    }
  );
  const data = response.data;
  console.log(data);
  //TODO: save transaction
  res.status(200).json({
    status: "success",
    message: "Payment verified",
    data,
  });
});
