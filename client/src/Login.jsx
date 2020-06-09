import React, { Component } from "react";

class Login extends Component {
  state = {};
  render() {
    return (
      <div className="container">
        <h3>Login to unlock all features</h3>
        <form action="">
          <label htmlFor="">Username</label>
          <input type="text" />
          <label htmlFor="">Password</label>
          <input type="text" />
          <button className="btn yellow darken-2">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
