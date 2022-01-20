if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((obj) => {
    console.log("Connection Successful");
  })
  .catch((databaseConnectionError) => {
    console.error(databaseConnectionError);
    console.error("DATABASE CONNECTION ERROR");
  });

app.use("/api", require("./routes/student.js"));
app.use("/api", require("./routes/grade.js"));
app.use("/api", require("./routes/attendance.js"));
app.use("/api", require("./routes/user.js"));

const path = require("path");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
