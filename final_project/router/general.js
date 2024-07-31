const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const BASE_URL = 'http://localhost:5001';

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    return res.status(400).json({ message: 'Username or password is empty' });
  }
  if (username && password) {
    if (isValid(username)) {
      return res.status(400).json({ message: 'Username already exists' });
    } else {
      users.push({ username, password });
      return res.status(200).json({ message: 'User created' });
    }
  }
  return res.status(400).json({ message: 'Username or password is empty' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const author_books = Object.values(books).filter(
    (item) => item.author === author
  );
  if (author_books.length === 0) {
    return res.status(404).json({ message: 'Author not found' });
  } else {
    return res.status(200).json(author_books);
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const title_books = Object.values(books).filter(
    (item) => item.title === title
  );
  if (title_books.length === 0) {
    return res.status(404).json({ message: 'Title not found' });
  } else {
    return res.status(200).json(title_books);
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: 'Review not found' });
  }
});

module.exports.general = public_users;
