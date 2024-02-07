const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "test1",
    "password": "test2024"
  },
  {
    "username": "user2",
    "password": "password2"
  }
];

const isValid = (username)=>{
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validUsers = users.filter(user => user.username === username && user.password === password);
  return validUsers.length > 0;
};


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("Username en sesión:", req.body.username);

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, 
      username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "book no found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", review: books[isbn].reviews[username] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn, 10);
  const username = req.session.authorization.username;
  console.log("Username en sesión:", req.session.username);

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; 
    return res.status(200).json({ message: "Review successfully removed." });
  } else {
    return res.status(404).json({ message: "Libro no encontrado o reseña no existente." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;