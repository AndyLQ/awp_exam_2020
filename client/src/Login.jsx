import React, { Component } from "react";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  handleLogin = (e) => {
    e.preventDefault();
    console.log("login", this.state.username, this.state.password);
    this.props.login(this.state.username, this.state.password);
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
            placeholder="username"
          ></input>
          <input
            onChange={this.handleChange}
            id="password"
            type="password"
            placeholder="password"
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
