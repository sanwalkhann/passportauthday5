const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const db = require("./config/db");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const cors = require("cors");

require('./config/passport')(passport);

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "sanwal123321",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter);
app.use("/", usersRouter);

// Start server
const PORT = 3400;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
