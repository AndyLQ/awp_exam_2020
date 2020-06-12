import React, { Component } from "react";
import { navigate } from "@reach/router";

class Register extends Component {
  state = {
    fullname: "",
    username: "",
    password: "",
  };
  //THE LOGIN METHOD
  //TODO LOOK IF USERNAME ALREADY EXISTS

  handleRegister = (e) => {
    e.preventDefault();
    this.props.registerUser(this.state);
    console.log("You registerd with fullname: ", this.state.fullname);
    console.log("You regitered with username: ", this.state.username);
    console.log("You registerd with password: ", this.state.password);
    window.location = "/login";
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleRegister}>
          <h3>Register</h3>
          <input
            onChange={this.handleChange}
            id="fullname"
            type="text"
            placeholder="Enter your fullname"
          ></input>
          <input
            onChange={this.handleChange}
            id="username"
            type="text"
            placeholder="Enter desired username"
          ></input>
          <input
            onChange={this.handleChange}
            id="password"
            type="password"
            placeholder="Enter desired password"
          ></input>
          <button className="btn yellow darken-2">
            <i class="material-icons left">add_circle</i>REGISTER
          </button>
        </form>
      </div>
    );
  }
}

export default Register;
