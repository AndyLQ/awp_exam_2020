const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const checkJwt = require("express-jwt");

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(express.static("../client/build"));

// let regex = /\w*/;
//These paths are accessable without a token
let openPaths = [
  { url: "/api/suggestions", methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/login", methods: ["GET"] },
  { url: "/api/users/authenticate", methods: ["POST"] },
];

// TODO: Hide the secret
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

//Route for users
const usersRouter = require("./routers/users_router")(secret);
app.use("/api/users", usersRouter);

app.get("*", (req, res) =>
  res.sendFile(path.resolve("..", "client", "build", "index.html"))
);

const url = process.env.MONGO_URL || "mongodb://localhost/suggestions_db";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await suggestionDB.fillIfEmpty();
    await app.listen(port);
    console.log(`Suggestion API running on port ${port}!`);
  })
  .catch((error) => console.error(error));
