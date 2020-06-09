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

let openPaths = [
  { url: "/api/suggestions", methods: ["GET"] },
  { url: "/api/users/authenticate", methods: ["POST"] },
];

const secret = process.env.SECRET || "the cake is a lie";
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
  const today = new Date().getDate();
  let thisMonth = new Date().getMonth() + 1;

  if (thisMonth == 6) {
    thisMonth = "June";
  } else if (thisMonth == 7) {
    thisMonth = "July";
  } else if (thisMonth == 8) {
    thisMonth = "August";
  } else if (thisMonth == 9) {
    thisMonth = "September";
  } else if (thisMonth == 10) {
    thisMonth = "October";
  } else if (thisMonth == 11) {
    thisMonth = "November";
  } else if (thisMonth == 12) {
    thisMonth = "December";
  } else if (thisMonth == 1) {
    thisMonth = "January";
  } else if (thisMonth == 2) {
    thisMonth = "February";
  } else if (thisMonth == 3) {
    thisMonth = "March";
  } else if (thisMonth == 4) {
    thisMonth = "April";
  } else if (thisMonth == 5) {
    thisMonth = "May";
  }

  const thisYear = new Date().getFullYear();
  const postDate = today + ". " + thisMonth + " " + thisYear;

  let suggestion = {
    content: req.body.content.content,
    date: postDate,
  };

  const newSuggestion = await suggestionDB.createSuggestion(suggestion);
  res.json(newSuggestion);
});

//Add new Signature to a suggestion
app.post("/api/suggestions/:id/signatures", async (req, res) => {
  const id = req.params.id;
  const signature = req.body.newSignature.name;

  // Get todays date
  const today = new Date().getDate();
  let thisMonth = new Date().getMonth() + 1;

  if (thisMonth == 6) {
    thisMonth = "June";
  } else if (thisMonth == 7) {
    thisMonth = "July";
  } else if (thisMonth == 8) {
    thisMonth = "August";
  } else if (thisMonth == 9) {
    thisMonth = "September";
  } else if (thisMonth == 10) {
    thisMonth = "October";
  } else if (thisMonth == 11) {
    thisMonth = "November";
  } else if (thisMonth == 12) {
    thisMonth = "December";
  } else if (thisMonth == 1) {
    thisMonth = "January";
  } else if (thisMonth == 2) {
    thisMonth = "February";
  } else if (thisMonth == 3) {
    thisMonth = "March";
  } else if (thisMonth == 4) {
    thisMonth = "April";
  } else if (thisMonth == 5) {
    thisMonth = "May";
  }

  const thisYear = new Date().getFullYear();
  const postDate = today + ". " + thisMonth + " " + thisYear;

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
