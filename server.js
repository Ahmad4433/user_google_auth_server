require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const strategy = require("./utils/googleStrategy");
const getConnection = require("./utils/getConnection");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/auth");
const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
     cookie: {
      secure: true, // set to true if using HTTPS
      sameSite: 'none', // important for cross-origin
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.send("server is listening");
});



app.use(passport.initialize());
app.use(passport.session());

// google strategy
strategy(app);

app.use("/user", authRoutes);

//
app.get("/user/info", (req, res, next) => {
  res
    .status(200)
    .json({ message: "success", status: true, user: req?.user?._json });
});

app.use(errorHandler);
getConnection();
app.listen(process.env.PORT, () =>
  console.log(`server is running on port: ${process.env.PORT}`)
);
