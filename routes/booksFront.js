const express = require("express");
const axios = require("axios");
const router = new express.Router();
let baseURL = "http://localhost:3000/api/books";
const ExpressError = require("../expressError");

router.get("/", async (req, res, next) => {
  try {
    const results = await axios.get(baseURL);
    const books = results.data.books;
    return res.render("bookList.html", { books });
  } catch (err) {
    return next(err);
  }
});

router.get("/add/", async (req, res, next) => {
  try {
    return res.render("addBookForm.html");
  } catch (err) {
    return next(err);
  }
});

router.get("/:isbn/", async (req, res, next) => {
  try {
    const results = await axios.get(`${baseURL}/${req.params.isbn}`);
    const book = results.data.book;
    return res.render("bookData.html", { book });
  } catch (err) {
    return next(
      new ExpressError(`There is no book with isbn ${req.params.isbn}`, 404)
    );
  }
});

router.post("/add/", async (req, res, next) => {
  try {
    const data = req.body;
    data.year = parseInt(data.year);
    data.pages = parseInt(data.pages);

    await axios.post(`${baseURL}`, data);
    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

router.get("/update/:isbn", async (req, res, next) => {
  try {
    const results = await axios.get(`${baseURL}/${req.params.isbn}`);
    const book = results.data.book;
    return res.render("updateBookForm.html", { book });
  } catch (err) {
    return next(
      new ExpressError(`There is no book with isbn ${req.params.isbn}`, 404)
    );
  }
});

router.post("/update/:isbn", async (req, res, next) => {
  try {
    const data = req.body;
    data.year = parseInt(data.year);
    data.pages = parseInt(data.pages);
    await axios.put(`${baseURL}/${req.params.isbn}`, data);
    return res.redirect(`/${req.params.isbn}`);
  } catch (err) {
    return next(err);
  }
});

router.get("/delete/:isbn", async (req, res, next) => {
  try {
    await axios.delete(`${baseURL}/${req.params.isbn}`);
    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
