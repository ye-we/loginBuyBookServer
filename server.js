const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 6000;

mongoose.connect(
  process.env.HOST,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to database");
    }
  }
);

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
