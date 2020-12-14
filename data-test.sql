



DROP DATABASE IF EXISTS books-test;

CREATE DATABASE books-test;

\c books-test

DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT,
  language TEXT, 
  pages INTEGER,
  publisher TEXT,
  title TEXT, 
  year INTEGER
);

INSERT INTO books
  VALUES ('1234567890', 'http://a.co/aaabbbb', 'Author Name', 'english', 254, 'A Publishing Company', 'Title Goes Here', 2020),
  ('9876543210', 'http://a.co/cccdddd', 'Author2 Name', 'english', 2, 'Random House', 'Exciting Title Goes Here', 2005)
