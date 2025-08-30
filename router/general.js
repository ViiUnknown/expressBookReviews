const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simulate async call (could be Axios GET to another service)
        const allBooks = await new Promise((resolve, reject) => {
            resolve(books);
        });
        return res.status(200).json(allBooks);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });
        return res.status(200).json(book);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const result = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(book => book.author.toLowerCase() === author);
            if (filtered.length > 0) resolve(filtered);
            else reject("No books found for this author");
        });
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const result = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(book => book.title.toLowerCase() === title);
            if (filtered.length > 0) resolve(filtered);
            else reject("No books found with this title");
        });
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
