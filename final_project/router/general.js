const express = require('express');
let books = require("./books.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

// This function search books for any field and returns the ISBN if an argument is found
var searchDB = function(myField, varToSearch, jsonData) {
  wStop = false;
  for (var key in jsonData) {
      if(typeof(jsonData[key]) === 'object') {
          searchDB(myField, varToSearch, jsonData[key]);
      } else {
          if(jsonData[key] == varToSearch && jsonData[key] == jsonData[myField]) {
              wStop = true;
              break;
          }
      }
      if (wStop){
        break;
      } else {
        key = 999;
      }
    }
  return key;
  } 


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register Customer."});  
});



/* // Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
}); */


// GET all books using Promise
  public_users.get('/',function (req, res) {
    const getAll = new Promise((resolve, reject) => {
          resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      getAll.then(() => console.log("Promise for all books resolved"));
  });

// GET one book by isbn using Promise
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const getOne = new Promise((resolve, reject) =>{
       if (books[isbn]){
        resolve(res.send(books[isbn])); 
      } else {
        resolve(res.send("ISBN not found in the database"));
      };   
    });
    getOne.then(() => console.log("Promise for isbn resolved"));
   });

// Get book details based on ISBN
/* public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]){
      res.send(books[isbn]); 
    } else {
      res.send("ISBN not found in the database")
    } 
 }); */

 // Get book details based on author using Promise
 public_users.get('/author/:author',function (req, res) {
  const wArgument = req.params.author;
  const getAuthor = new Promise((resolve, reject) =>{
    const wResult = searchDB("author", wArgument, books);
    if (wResult !== 999){
      resolve(res.send(books[wResult])); 
    }else {
      resolve(res.send("Author: " + wArgument + " not found in the database"));
    }; 
  });
  getAuthor.then(() => console.log("Promise for Author resolved"));
});

// Get book details based on author
/* public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const wArgument = req.params.author;
  const wResult = searchDB("author", wArgument, books);
  if (wResult !== 999){
      res.send(books[wResult]); 
    }else {
      res.send("Author: " + wArgument + " not found in the database");
    } 
}); */

 // Get book details based on title using Promise
 public_users.get('/title/:title',function (req, res) {
  const wArgument = req.params.title;
  const getTitle = new Promise((resolve, reject) =>{
    const wResult = searchDB("title", wArgument, books);
    if (wResult !== 999){
      resolve(res.send(books[wResult])); 
    }else {
      resolve(res.send("Title: " + wArgument + " not found in the database"));
    }; 
  });
  getTitle.then(() => console.log("Promise for Title resolved"));
});

// Get all books based on title
/* public_users.get('/title/:title',function (req, res) {
  const wArgument = req.params.title;
  const wResult = searchDB("title", wArgument, books);
  if (wResult !== 999){
      res.send(books[wResult]); 
    }else {
      res.send("Title: " + wArgument + " not found in the database");
    } 
}); */

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "(book review) Yet to be implemented"});
  const isbn = req.params.isbn;
  let myBook = books[isbn];
  if (myBook){
      res.send(myBook["reviews"]); 
    } else {
      res.send("ISBN not found in the database")
    } 
});

module.exports.general = public_users;
