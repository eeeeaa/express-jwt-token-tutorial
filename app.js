const express = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

//Verify token
function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.header("authorization");

  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Token format in the header:
    // Authorization: Bearer <access_token>

    //split the string
    const bearer = bearerHeader.split(" ");
    //get the access token
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    //Forbidden route
    res.sendStatus(403);
  }
}

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to API",
  });
});

//protected route
app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  //Mock user
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };

  //create a secure jwt token
  //usually, client/front-end would save this token to local storage,
  //then send it in header to access protected routes
  jwt.sign(
    { user },
    process.env.SECRET_KEY,
    { expiresIn: "30s" },
    (err, token) => {
      res.json({
        token,
      });
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
