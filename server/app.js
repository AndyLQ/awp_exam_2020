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

const users = [
  { id: 0, username: "krdo", password: "123", fullname: "Kristian Teacher" },
  {
    id: 1,
    username: "tosk",
    password: "password",
    fullname: "Torill Supervisor",
  },
  { id: 2, username: "alq", password: "quach", fullname: "Andy Le Quach" },
  { id: 3, username: "idali", password: "beno", fullname: "Benjamin idali" },
  { id: 4, username: "asferg", password: "alex", fullname: "Alexander Asferg" },
];

users.forEach(async (user) => {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  user.hash = hashedPassword; // The hash has been made, and is stored on the user object.
  delete user.password; // Let's remove the clear text password (it shouldn't be there in the first place)
  console.log(`Hash generated for ${user.username}:`, user); // Logging for debugging purposes
});

// let regex = /\w*/;
//These paths are accessable without a token
let openPaths = [
  { url: "/login", methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  // { url: "/sw.js", methods: ["GET"] },
  // { url: "/api/", methods: ["GET"] },
  { url: "/api/suggestions", methods: ["GET"] },
  { url: "/api/users", methods: ["GET"] },
  // { url: "/suggestions/5ee10018a65724050029ca5b", methods: ["GET"] },
  // { url: "/api/suggestions/*", methods: ["GET"] },
  // { url: "/api/suggestions/" + regex, methods: ["GET", "POST"] },
  { url: "/api/users/authenticate", methods: ["POST"] },
];

//TODO Hide the secret
const secret = process.env.SECRET || "avocado";
//This says no access without token unless its a part of openPaths
app.use(checkJwt({ secret: secret }).unless({ path: openPaths }));

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    // If the user didn't authorize correctly
    res.status(401).json({ error: err.message }); // Return 401 with error message.
  } else {
    next(); // If no errors, forward request to next middleware or route
  }
});

/**** Database ****/
const suggestionDB = require("./suggestion_db")(mongoose);

/**** Routes ****/
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

app.post("/", (req, res) => {
  // TODO: Implement user account creation
  res.status(501).json({ msg: "create new user not implemented" });
});

app.put("/", (req, res) => {
  // TODO: Implement user update (change password, etc).
  res.status(501).json({ msg: "update user not implemented" });
});

// This route takes a username and a password and create an auth token
app.post("/authenticate", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    let msg = "Username or password missing!";
    console.error(msg);
    res.status(401).json({ msg: msg });
    return;
  }

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
