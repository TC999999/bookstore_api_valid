/** Express app for bookstore. */

const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

const ExpressError = require("./expressError");
const bookRoutes = require("./routes/books");
const frontEndRoutes = require("./routes/booksFront");

app.use("/api/books", bookRoutes);
app.use(frontEndRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  return res.render("error.html", { err });
  // return res.json({ err });
});

module.exports = app;
