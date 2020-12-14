const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
const { DB_URI } = require("../config");

let b1, b2;

beforeEach(async function () {
  // await db.query(`DROP TABLE books`);
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
  // await db.query("DELETE FROM books");

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
});

afterEach(async function () {
  // await db.query("DELETE FROM books");
  await db.query(`DROP TABLE books`);
});

afterAll(async function () {
  await db.end();
});

describe("GET /books", function () {
  test("Gets all books", async function() {
    const res = await request(app).get(`/books`);
    expect(res.statusCode).toEqual(200);
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
    const res = await request(app).get(`/books/0123456789`);
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