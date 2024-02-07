const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
  res.send(books)
  return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const id = parseInt(req.params.isbn, 10);
  const book = books[id];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});


public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === authorName);

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "Author not found" });
  }
  return res.status(200).json(filteredBooks);
});


public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === titleName);

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "Author not found" });
  }

  return res.status(200).json(filteredBooks);
});


public_users.get('/review/:isbn', function (req, res) {
  const id = parseInt(req.params.isbn, 10);
  const book = books[id];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;