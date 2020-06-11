const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const checkJwt = require("express-jwt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(express.static("../client/build"));

const secret = process.env.SECRET || "avocado";
//This says no access without token unless its a part of openPaths

//These paths are accessable without a token

// var regexLiteral = /\w*/;

let openPaths = [
  { url: "/login", methods: ["GET"] },
  { url: "/user", methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  // { url: "/sw.js", methods: ["GET"] },
  // { url: "/api/", methods: ["GET"] },
  { url: "/api/suggestions", methods: ["GET"] },
  { url: "/api/users", methods: ["GET"] },
  { url: "/api/users", methods: ["GET"] },
  // { url: "/suggestions/" + regexLiteral, methods: ["GET"] },
  // { url: "/api/suggestions/*", methods: ["GET"] },
  // { url: "/api/suggestions/" + regex, methods: ["GET", "POST"] },
  { url: "/api/users/authenticate", methods: ["POST"] },
  { url: "/api/authenticate", methods: ["POST"] },
];

app.use(checkJwt({ secret: secret }).unless({ path: openPaths }));

/**** Database ****/
const suggestionDB = require("./suggestion_db")(mongoose);

//This code is used for hashing passwords

// users.forEach(async (user) => {
//   const hashedPassword = await new Promise((resolve, reject) => {
//     console.log(user.password);
//     bcrypt.hash(user.password, 10, function (err, hash) {
//       if (err) reject(err);
//       else resolve(hash);
//     });
//   });

//   // The hash has been made, and is stored on the user object.
//   user.hash = hashedPassword;

//   // Let's remove the clear text password (it shouldn't be there in the first place)
//   delete user.password;
//   console.log(`Hash generated for ${user.username}:`, user); // Logging for debugging purposes
//   console.log("Users!!!: ", users);
// });

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    // If the user didn't authorize correctly
    res.status(401).json({ error: err.message }); // Return 401 with error message.
  } else {
    next(); // If no errors, forward request to next middleware or route
  }
});

/**** Routes ****/

app.post("/api/users/authenticate", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    let msg = "Username or password missing!";
    console.error(msg);
    res.status(401).json({ msg: msg });
    return;
  }

  const users = await suggestionDB.getUsers();

  console.log("Users: ", users);

  const user = users.find((user) => user.username === username);
  if (user) {
    // If the user is found
    bcrypt.compare(password, user.hash, (err, result) => {
      if (result) {
        // If the password matched
        const payload = { username: username };
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        res.json({
          msg: `User '${username}' authenticated successfully`,
          token: token,
        });
      } else res.status(401).json({ msg: "Password mismatch!" });
    });
  } else {
    res.status(404).json({ msg: "User not found!" });
  }
});

//For getting the suggestions
app.get("/api/suggestions", async (req, res) => {
  const suggestion = await suggestionDB.getSuggestions();
  res.json(suggestion);
});

//Getting users
app.get("/api/users", async (req, res) => {
  const user = await suggestionDB.getUsers();
  res.json(user);
});

//Getting a user
app.get("/api/users/:id", async (req, res) => {
  let id = req.params.id;
  const user = await suggestionDB.getUser(id);
  res.json(user);
});

//for getting a specific suggestion based on the id
app.get("/api/suggestions/:id", async (req, res) => {
  let id = req.params.id;
  const suggestion = await suggestionDB.getSuggestion(id);
  res.json(suggestion);
});

//Add new suggestion
app.post("/api/suggestions", async (req, res) => {
  const postDate = suggestionDB.getToday();
  console.log("The date of the post is ", postDate);

  let suggestion = {
    content: req.body.content,
    body: req.body.body,
    date: postDate,
    uploadUser: req.body.uploadUser,
  };

  const newSuggestion = await suggestionDB.createSuggestion(suggestion);
  res.json(newSuggestion);
});

//Add new Signature to a suggestion
app.post("/api/suggestions/:id/signatures", async (req, res) => {
  const id = req.params.id;
  const signature = req.body.newSignature.name;
  const postDate = suggestionDB.getToday();
  console.log("The date of the post is ", postDate);

  const newSignature = { name: signature, date: postDate };
  const updatedSuggestion = await suggestionDB.addSignature(id, newSignature);
  res.json(updatedSuggestion);
});

app.get("*", (req, res) =>
  res.sendFile(path.resolve("..", "client", "build", "index.html"))
);

// Routes for users

//Adding a user - Does not work yet
app.post("/", (req, res) => {
  // TODO: Implement user account creation
  res.status(501).json({ msg: "create new user not implemented" });
});

//Changing a user - Does not work yet
app.put("/", (req, res) => {
  // TODO: Implement user update (change password, etc).
  res.status(501).json({ msg: "update user not implemented" });
});

// This route takes a username and a password and create an auth token

const url = process.env.MONGO_URL || "mongodb://localhost/suggestions_db";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await suggestionDB.fillIfEmpty();
    await suggestionDB.initUsers();
    await app.listen(port);
    console.log(`Suggestion API running on port ${port}!`);
  })
  .catch((error) => console.error(error));
