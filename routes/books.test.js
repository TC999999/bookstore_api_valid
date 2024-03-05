process.env.NODE_ENV = "test";

const db = require("../db");
const request = require("supertest");
const app = require("../app");

// const Book = require("../models/book");

let testBook;
beforeEach(async () => {
  await db.query("DELETE FROM books");
  let u = await request(app).post("/api/books").send({
    isbn: "00000000000",
    amazon_url: "test link",
    author: "Test Author",
    language: "english",
    pages: 9000,
    publisher: "Test Publisher",
    title: "Test Title",
    year: 2024,
  });
  testBook = u.body.book;
});

describe("GET /api/books", () => {
  test("get a list with a single book", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ books: [testBook] });
  });
});

describe("GET /api/books/:isbn", () => {
  test("get a single book with isbn", async () => {
    const res = await request(app).get(`/api/books/${testBook.isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ book: testBook });
  });

  test("return 404 if isbn does not exist", async () => {
    const res = await request(app).get(`/api/books/11111111111`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /api/books", () => {
  test("create a single book", async () => {
    let res = await request(app).post("/api/books").send({
      isbn: "2222222222",
      amazon_url: "Test Link 2",
      author: "Test Author 2",
      language: "english",
      pages: 500,
      publisher: "Test Publisher 2",
      title: "Test Title 2",
      year: 2020,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      book: {
        isbn: "2222222222",
        amazon_url: "Test Link 2",
        author: "Test Author 2",
        language: "english",
        pages: 500,
        publisher: "Test Publisher 2",
        title: "Test Title 2",
        year: 2020,
      },
    });
  });

  test("responds with 400 if any information is missing", async () => {
    let res = await request(app).post("/api/books").send({
      isbn: "2222222222",
      amazon_url: "Test Link 2",
      author: "Test Author 2",
      language: "english",
      publisher: "Test Publisher 2",
      title: "Test Title 2",
    });
    expect(res.statusCode).toBe(400);
    // expect(res.err.message).toEqual(expect.any(Array));
  });
});

describe("PUT /api/books/:isbn", () => {
  test("updates an already existing  book", async () => {
    let res = await request(app).put(`/api/books/${testBook.isbn}`).send({
      isbn: testBook.isbn,
      amazon_url: testBook.amazon_url,
      author: "New Test Author",
      language: "spanish",
      pages: testBook.pages,
      publisher: "New Test Publisher",
      title: "New Test Title",
      year: 2019,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      book: {
        isbn: testBook.isbn,
        amazon_url: testBook.amazon_url,
        author: "New Test Author",
        language: "spanish",
        pages: testBook.pages,
        publisher: "New Test Publisher",
        title: "New Test Title",
        year: 2019,
      },
    });
  });

  test("responds with 404 if isbn does not exist", async () => {
    let res = await request(app).put(`/api/books/2222222222`).send({
      isbn: "2222222222",
      amazon_url: "Test Link 2",
      author: "Test Author 2",
      language: "english",
      pages: 500,
      publisher: "Test Publisher 2",
      title: "Test Title 2",
      year: 2020,
    });
    expect(res.statusCode).toBe(404);
  });

  test("responds with 400 if any information is missing", async () => {
    let res = await request(app).put(`/api/books/${testBook.isbn}`).send({
      isbn: testBook.isbn,
      amazon_url: testBook.amazon_url,
      pages: testBook.pages,
    });
    expect(res.statusCode).toBe(400);

    // expect(res.err.message).toEqual(expect.any(Array));
  });
});

describe("DELETE /api/books/:isbn", () => {
  test("deletes a single book", async () => {
    let res = await request(app).delete(`/api/books/${testBook.isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Book deleted" });
  });

  test("returns 404 if isbn does not exist", async () => {
    let res = await request(app).delete(`/api/books/1111111111`);
    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await db.end();
});
