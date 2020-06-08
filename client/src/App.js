import React, { Component } from "react";
import { Router } from "@reach/router";
import Suggestion from "./Suggestion";
import Suggestions from "./Suggestions";
import Navbar from "./Navbar";
import AddSuggestion from "./AddSuggestion";
import Login from "./Login";

class App extends Component {
  // API url from the file '.env' OR the file '.env.development'.
  // The first file is only used in production.
  API_URL = process.env.REACT_APP_API_URL;

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
    };
  }

  // Get everything from the API when the component mounts
  //Then log it in the console
  componentDidMount() {
    this.getSuggestions().then(() =>
      console.log("Suggestions gotten from API and put into app state!")
    );
  }

  async getSuggestions() {
    let url = `${this.API_URL}/suggestions`; // URL of the API
    let result = await fetch(url); // Get the data
    let json = await result.json(); // Turn it into json
    return this.setState({
      // Set it in the state
      suggestions: json,
    });
  }

  getSuggestion(id) {
    // Find the relevant suggestion by id
    return this.state.suggestions.find((k) => k._id === id);
  }
  addSuggestion = (suggestion) => {
    let suggestionList = [...this.state.suggestions, suggestion];
    this.setState({ suggestions: suggestionList });
    console.log("The new state is: ", this.state, this.props);
  };

  render() {
    return (
      <>
        <Navbar></Navbar>
        <Router>
          <Suggestions path="/" suggestions={this.state.suggestions} />
          <Suggestion
            path="/suggestion/:id"
            getSuggestion={(id) => this.getSuggestion(id)}
          />
          <AddSuggestion
            path="/add-suggestion"
            addSuggestion={this.addSuggestion}
          />
          <Login path="/login" />
        </Router>
      </>
    );
  }
}

export default App;
