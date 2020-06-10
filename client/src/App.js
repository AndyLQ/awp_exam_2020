import React, { Component } from "react";
import { Router, navigate } from "@reach/router";
import Suggestion from "./Suggestion";
import Suggestions from "./Suggestions";
import Navbar from "./Navbar";
import AddSuggestion from "./AddSuggestion";
import Login from "./Login";
import AuthService from "./AuthService";

class App extends Component {
  API_URL = process.env.REACT_APP_API_URL;

  constructor(props) {
    super(props);
    this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
    this.state = {
      suggestions: [],
      userCredentials: {
        username: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    this.getSuggestions();
  }

  componentDidUpdate() {
    this.isLoggedContent()
      ? console.log("You are logged in")
      : console.log("You are not logged in");
  }

  async login(username, password) {
    try {
      const resp = await this.Auth.login(username, password);
      console.log("Authentication:", resp.msg);
      alert("Welcome " + this.Auth.getUsername() + " - Good to see you!");
      navigate("/");
      this.getSuggestions();
    } catch (error) {
      console.log("Login", error);
      alert("Login Failed, Try again");
    }
  }

  logout() {
    this.Auth.logout();
    navigate("/");
    this.getSuggestions();
  }

  isLoggedContent() {
    if (this.Auth.loggedIn()) {
      return true;
    } else {
      return false;
    }
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
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        newSignature: newSignature,
      }),
    });
  }

  async addSuggestion(suggestion) {
    await fetch(`/api/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        content: suggestion.content,
        body: suggestion.body,
        uploadUser: suggestion.uploadUser,
      }),
    });
  }

  render() {
    return (
      <>
        {/* <button onClick={() => this.logout()}>Log out</button> */}
        <Navbar
          logout={() => this.logout()}
          isloggedContent={this.isLoggedContent()}
        ></Navbar>
        <Router>
          <Suggestions path="/" suggestions={this.state.suggestions} />
          <Suggestion
            path="/suggestions/:id"
            getSuggestion={(id) => this.getSuggestion(id)}
            addSignature={this.addSignature}
            isloggedContent={this.isLoggedContent()}
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
