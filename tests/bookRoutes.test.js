const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
const { DB_URI } = require("../config");

process.env.NODE_ENV = "test"

let b1, b2, bookIsbn;

beforeEach(async function () {
  await db.query(`DROP TABLE IF EXISTS books`);
  await db.query(`
    CREATE TABLE books (
      isbn TEXT PRIMARY KEY,
      amazon_url TEXT,
      author TEXT,
      language TEXT, 
      pages INTEGER,
      publisher TEXT,
      title TEXT, 
      year INTEGER
    )
  `);

  b1 = await Book.create({
    isbn: "0123456789",
    amazon_url: "http://a.co/eobtttt",
    author: "RJ Martz",
    language: "english",
    pages: 300,
    publisher: "Princeton University Press",
    title: "How to Entertain Any Audience",
    year: 2018
  });

  b2 = await Book.create({
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking Hidden Math in Video Games",
    year: 2017
  });

  bookIsbn = b1.isbn;
});

afterEach(async function () {
  // await db.query("DELETE FROM books");
  await db.query(`DROP TABLE IF EXISTS books`);
});

afterAll(async function () {
  await db.end();
});

describe("GET /books", function () {
  test("Gets all books", async function() {
    const res = await request(app).get(`/books`);
    const books = res.body.books;
    expect(res.statusCode).toEqual(200);
    expect(books).toHaveLength(2);
    expect(books[0]).toHaveProperty("isbn");
    expect(res.body).toEqual({
      "books": [
        {
          "isbn": "0123456789",
          "amazon_url": "http://a.co/eobtttt",
          "author": "RJ Martz",
          "language": "english",
          "pages": 300,
          "publisher": "Princeton University Press",
          "title": "How to Entertain Any Audience",
          "year": 2018
        },
        {
          "isbn": "0691161518",
          "amazon_url": "http://a.co/eobPtX2",
          "author": "Matthew Lane",
          "language": "english",
          "pages": 264,
          "publisher": "Princeton University Press",
          "title": "Power-Up: Unlocking Hidden Math in Video Games",
          "year": 2017
        }
      ]
    });
  });
});

describe("GET /books/:isbn", function () {
  test("Gets a book by isbn", async function() {
    const res = await request(app).get(`/books/${bookIsbn}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      "book": {
        "isbn": "0123456789",
        "amazon_url": "http://a.co/eobtttt",
        "author": "RJ Martz",
        "language": "english",
        "pages": 300,
        "publisher": "Princeton University Press",
        "title": "How to Entertain Any Audience",
        "year": 2018
      }
    });
    expect(res.body.book).toHaveProperty("amazon_url");
    expect(res.body.book.isbn).toBe(bookIsbn);
  });

  test("Responds with 404 if book not found", async function() {
    const res = await request(app).get(`/books/1`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("POST /books", function () {
  test("Creates a book", async function() {
    const res = await request(app)
      .post(`/books`)
      .send({
        book: {
          isbn: '54794759',
          amazon_url: "https://book.com",
          author: "mctest",
          language: "english",
          pages: 250,
          publisher: "Some Publisher",
          title: "Coding Forever",
          year: 2011
        }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      "book": {
        "isbn": '54794759',
        "amazon_url": "https://book.com",
        "author": "mctest",
        "language": "english",
        "pages": 250,
        "publisher": "Some Publisher",
        "title": "Coding Forever",
        "year": 2011
      }
    });
  });
});

describe("POST /books", function () {
  test("400 status code if language field is missing when creating new book", async function() {
    const res = await request(app)
      .post(`/books`)
      .send({
        book: {
          isbn: '54794759',
          amazon_url: "https://book.com",
          author: "mctest",
          pages: 250,
          publisher: "Some Publisher",
          title: "Coding Forever",
          year: 2011
        }
      });
    expect(res.statusCode).toEqual(400);
  });
});

describe("PUT /books/:isbn", function () {
  test("Updates a book", async function() {
    const res = await request(app)
      .put(`/books/0123456789`)
      .send({
        book: {
          isbn: "0123456789",
          amazon_url: "http://a.co/hgfdhgf",
          author: "Ryan Martz",
          language: "english",
          pages: 280,
          publisher: "Publisher Press",
          title: "How to Trick Any Audience",
          year: 2020
        }
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      "book": {
        "isbn": "0123456789",
        "amazon_url": "http://a.co/hgfdhgf",
        "author": "Ryan Martz",
        "language": "english",
        "pages": 280,
        "publisher": "Publisher Press",
        "title": "How to Trick Any Audience",
        "year": 2020
      }
    });
  });
});

describe("PUT /books/:isbn", function () {
  test("404 when isbn of book to update does not exist", async function() {
    const res = await request(app)
      .put(`/books/012`)
      .send({
        book: {
          isbn: "0123456789",
          amazon_url: "http://a.co/hgfdhgf",
          author: "Ryan Martz",
          language: "english",
          pages: 280,
          publisher: "Publisher Press",
          title: "How to Trick Any Audience",
          year: 2020
        }
      });
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /books/:isbn", function () {
  test("Deletes a book", async function() {
    const res = await request(app)
      .delete(`/books/0123456789`)
    ;
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      message: "Book deleted"
    });
  });
});