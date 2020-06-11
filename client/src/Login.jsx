import React, { Component } from "react";
import AuthService from "./AuthService";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  handleLogin = (e) => {
    e.preventDefault();
    console.log("You logged with username:", this.state.username);
    console.log("You logged with pasword:", this.state.password);
    this.props.login(this.state.username, this.state.password);
    this.setFullname();
  };

  setFullname = () => {
    const uName = this.state.username;
    const fName = "JOHN";
    //I want the username of the user
    //with that imma find the name
    //and that, im gonna store in the local storage
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleLogin}>
          <h3>Login</h3>
          <input
            onChange={this.handleChange}
            id="username"
            type="text"
            placeholder="Username"
          ></input>
          <input
            onChange={this.handleChange}
            id="password"
            type="password"
            placeholder="Password"
          ></input>
          <button className="btn yellow darken-2">
            <i class="material-icons left">fingerprint</i>Login
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
