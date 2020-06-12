const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const checkJwt = require("express-jwt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(express.static("../client/build"));

const secret = process.env.SECRET || "avocado";

//These paths are accessable without a token
let openPaths = [
  { url: "/login", methods: ["GET"] },
  { url: "/register", methods: ["GET", "POST"] },
  { url: "/user", methods: ["GET"] },
  { url: "/users", methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/api/suggestions", methods: ["GET"] },
  { url: "/api/register", methods: ["GET"] },
  { url: "/api/users", methods: ["GET", "POST"] },
  { url: "/api/user", methods: ["GET"] },
  { url: "/api/users/authenticate", methods: ["POST"] },
  { url: "/api/authenticate", methods: ["POST"] },
];

app.use(checkJwt({ secret: secret }).unless({ path: openPaths }));

/**** Database ****/
const suggestionDB = require("./suggestion_db")(mongoose);

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
    bcrypt.compare(password, user.password, (err, result) => {
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

  let suggestion = {
    content: req.body.content,
    body: req.body.body,
    date: postDate,
    uploadUser: req.body.uploadUser,
    uploadFullname: req.body.uploadFullname,
  };

  const newSuggestion = await suggestionDB.createSuggestion(suggestion);
  res.json(newSuggestion);
});

//Delete user
// app.delete("/api/suggestions", async (req, res) => {
//   let id = req.body.id;
//   suggestionDB.deleteSuggestion(id);
// });

//regitering new user
app.post("/api/users", async (req, res) => {
  console.log("!!!!!!!!", req.body);
  const postDate = suggestionDB.getToday();

  let user = {
    fullname: req.body.fullname.fullname,
    username: req.body.fullname.username,
    password: req.body.fullname.password,
    dateCreated: postDate,
    admin: false,
  };
  console.log("!!!!!!!! JUICER !!!!!!", user);

  const newUser = await suggestionDB.registerUser(user);
  res.json(newUser);
});

//Add new Signature to a suggestion
app.post("/api/suggestions/:id/signatures", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const fullname = req.body.fullname;
  const postDate = suggestionDB.getToday();
  console.log("The date of the post is ", postDate);

  const newSignature = { name: name, date: postDate, fullname: fullname };
  const updatedSuggestion = await suggestionDB.addSignature(id, newSignature);
  res.json(updatedSuggestion);
});

app.get("*", (req, res) =>
  res.sendFile(path.resolve("..", "client", "build", "index.html"))
);

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
