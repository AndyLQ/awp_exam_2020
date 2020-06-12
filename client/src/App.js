import React, { Component } from "react";
import { Router, navigate } from "@reach/router";
import Suggestion from "./Suggestion";
import Suggestions from "./Suggestions";
import Navbar from "./Navbar";
import AddSuggestion from "./AddSuggestion";
import Login from "./Login";
import AuthService from "./AuthService";
import User from "./User";
import Register from "./Register";

class App extends Component {
  API_URL = process.env.REACT_APP_API_URL;

  constructor(props) {
    super(props);
    this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
    this.state = {
      suggestions: [],
      users: [],
    };
  }

  componentDidMount() {
    this.getSuggestions();
    this.getUsers();
  }

  componentDidUpdate() {
    if (this.isLoggedContent()) {
      this.getLoggedUser();
      console.log("You are logged in");
    } else {
      console.log("You are not logged in");
    }
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

  async getUsers() {
    let url = `${this.API_URL}/users`;
    let result = await fetch(url);
    let json = await result.json();
    this.setState({
      users: json,
    });
  }

  getSuggestion(id) {
    return this.state.suggestions.find((suggestion) => suggestion._id === id);
  }

  getLoggedUser() {
    console.log("JOHHNYYYYYY ", this.state.users);
    if (this.state.users.length !== 0) {
      const loggedUser = localStorage.getItem("username");
      const newUsers = this.state.users.filter(
        (user) => user.username === loggedUser
      );
      const user = newUsers[0];
      this.storeUser(user);
    }
  }

  storeUser(user) {
    const fullnameUser = user.fullname;
    localStorage.setItem("fullname", fullnameUser);
    const idUser = user._id;
    localStorage.setItem("id", idUser);
    const dateUser = user.dateCreated;
    localStorage.setItem("userCreateDate", dateUser);
    const isAdmin = user.admin;
    localStorage.setItem("admin", isAdmin);
  }

  async addSignature(newSignature, suggestionId) {
    console.log(newSignature);
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
    this.getSuggestions();
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

  async registerUser(fullname, username, password) {
    console.log(fullname, username, password);
    await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        fullname: fullname,
        username: username,
        password: password,
      }),
    });
  }

  render() {
    // console.log(this.state);
    return (
      <>
        {/* <button onClick={() => this.logout()}>Log out</button> */}
        <Navbar
          logout={() => this.logout()}
          isloggedContent={this.isLoggedContent()}
          users={this.state.users}
        ></Navbar>
        <Router>
          <Suggestions path="/" suggestions={this.state.suggestions} />
          <Suggestion
            path="/suggestions/:id"
            getSuggestion={(id) => this.getSuggestion(id)}
            addSignature={this.addSignature}
            getSuggestions={() => this.getSuggestions()}
            isloggedContent={this.isLoggedContent()}
          />
          <AddSuggestion
            path="/add-suggestion"
            addSuggestion={this.addSuggestion}
          />
          <Login
            path="/login"
            login={(username, password) => this.login(username, password)}
            getLoggedUser={this.getLoggedUser}
          />
          <User path="/user"></User>
          <Register
            path="/register"
            registerUser={this.registerUser}
            getUsers={this.getUsers}
            users={this.state.users}
          ></Register>
        </Router>
      </>
    );
  }
}

export default App;
