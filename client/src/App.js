import React, { Component } from "react";
import { Router } from "@reach/router";
import Suggestion from "./Suggestion";
import Suggestions from "./Suggestions";
import Navbar from "./Navbar";
import AddSuggestion from "./AddSuggestion";
import Login from "./Login";
import AuthService from "./AuthService";
import { navigate } from "@reach/router";

class App extends Component {
  API_URL = process.env.REACT_APP_API_URL;

  constructor(props) {
    super(props);
    this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
    this.state = {
      suggestions: [],
    };
  }

  componentDidMount() {
    this.getSuggestions();
  }

  async login(username, password) {
    try {
      const resp = await this.Auth.login(username, password);
      console.log("Authentication:", resp.msg);
      alert("You are now logged in");
      navigate("/");
      this.getSuggestions();
    } catch (e) {
      console.log("Login", e);
      alert("Login Failed, Try again");
    }
  }

  async logout(event) {
    // TODO
  }

  async getSuggestions() {
    let url = `${this.API_URL}/suggestions`;
    let result = await fetch(url);
    let json = await result.json();
    return this.setState({
      suggestions: json,
    });
  }

  getSuggestion(id) {
    return this.state.suggestions.find((k) => k._id === id);
  }

  async addSignature(newSignature, suggestionId) {
    await fetch(`/api/suggestions/${suggestionId}/signatures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newSignature: newSignature,
      }),
    });
  }

  async addSuggestion(suggestion) {
    console.log("This is your suggestion tho: ", suggestion);
    await fetch(`/api/suggestions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: suggestion,
      }),
    });
  }

  render() {
    return (
      <>
        <Navbar></Navbar>
        <Router>
          <Suggestions path="/" suggestions={this.state.suggestions} />
          <Suggestion
            path="/suggestions/:id"
            getSuggestion={(id) => this.getSuggestion(id)}
            addSignature={this.addSignature}
          />
          <AddSuggestion
            path="/add-suggestion"
            addSuggestion={this.addSuggestion}
          />
          <Login
            path="/login"
            login={(username, password) => this.login(username, password)}
          />
        </Router>
      </>
    );
  }
}

export default App;
