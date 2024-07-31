const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

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
  const getBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
  });

  getBooksPromise
    .then((result) => {
      return res.status(200).json({ books: result });
    })
    .catch((err) => {
      return res.status(404).json({ message: 'Error fetching books' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject('Book not found');
        }
      }, 600);
    });
  };

  getBookByIsbn(isbn)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const getBookByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const author_books = Object.values(books).filter(
          (item) => item.author === author
        );
        if (author_books.length === 0) {
          reject('Author not found');
        } else {
          resolve(author_books);
        }
      }, 600);
    });
  };

  getBookByAuthor(author)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const title_books = Object.values(books).filter(
          (item) => item.title === title
        );
        if (title_books.length === 0) {
          reject('Title not found');
        } else {
          resolve(title_books);
        }
      }, 600);
    });
  };

  getBookByTitle(title)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
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
