import React, { Component } from "react";
import { Link } from "@reach/router";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  handleLogin = (e) => {
    e.preventDefault();
    console.log("You logged with username:", this.state.username);
    console.log("You logged with password:", this.state.password);
    this.props.login(this.state.username, this.state.password);
    // this.props.getLoggedUser();
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
        <br />
        <h5>No account?</h5>
        <Link to="/register">
          <button className="btn yellow darken-2">REGISTER NEW ACCOUNT</button>
        </Link>
      </div>
    );
  }
}

export default Login;
