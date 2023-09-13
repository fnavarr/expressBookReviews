const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./books.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const reviewUpdated = (user, newReview, oldReview ) =>{
  //console.log("** Recibimos: ", user, newReview, oldReview ); 
  let result = "[" + user + "]: " + newReview;  // New Review
  if(newReview){
    if(oldReview.reviews == null || JSON.stringify(oldReview.reviews) == "{}"){
      oldReview.reviews = result;
      //console.log("Despues de analisar review: ", result);   
    } 
    if(oldReview.reviews.includes(user)) {
      oldReview.reviews = null;
      oldReview.reviews = result;
    } else {
      //let result = "[" + user + "]: " + newReview;  // Add Review from another user
      oldReview.reviews = oldReview.reviews + " ** " + result;
    }
  } else {  // User wants to erease his review
    if(oldReview.reviews !== null) {
      if(oldReview.reviews.includes(user)) {        // Same user, can erease review
        oldReview.reviews = null;
      }
    }
  }
  return oldReview; 
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let myBook = books[isbn];
  let user = req.body.username;
  //console.log("myBook antes del if: ", myBook);
  if (myBook){
      let reviews = req.query.reviews;
      //console.log("Esto tengo en myBook: ", myBook.reviews);
      books[isbn] = reviewUpdated(user, reviews, myBook);   // Process reviews
      //console.log("book despues de mover mybook", books[isbn]);
      if(myBook.reviews === null){
        res.send(`The Review for the ISBN ${isbn} posted by the user ${user} has been deleted.`);
      }else{
        if(myBook.reviews.includes(user)){
          res.send(`Reviews for the book with ISBN ${isbn} has been added/updated.`);
        }else{
          res.send(`No Reviews with ISBN ${isbn} found for user ${user}`)
        }
      }     
  } else {
      res.send("ISBN not found in the database")
  } 
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
