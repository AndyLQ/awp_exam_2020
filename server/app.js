const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan("combined")); // Log all requests to the console
app.use(express.static("../client/build")); // Needed for serving production build of React

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

app.post("/api/suggestions", async (req, res) => {
  let suggestion = {
    content: req.body.content,
  };
  const newSuggestion = await suggestionDB.createSuggestion(suggestion);
  res.json(newSuggestion);
});

app.post("/api/suggestions/:id/signatures", async (req, res) => {
  const id = req.params.id;
  const signature = req.body.name;

  //Get todays date
  const today = new Date().getDate();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const postDate = today + "/" + thisMonth + "/" + thisYear;
  console.log(postDate);
  const newSignature = { name: signature, date: postDate };
  console.log("The signature you just passed is: ", newSignature);
  const updatedSuggestion = await suggestionDB.addSignature(id, newSignature);
  res.json(updatedSuggestion);
});

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get("*", (req, res) =>
  res.sendFile(path.resolve("..", "client", "build", "index.html"))
);

/**** Start ****/
const url = process.env.MONGO_URL || "mongodb://localhost/suggestions_db";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await suggestionDB.fillIfEmpty(); // Fill in test data if needed.
    await app.listen(port); // Start the API
    console.log(`Suggestion API running on port ${port}!`);
  })
  .catch((error) => console.error(error));
