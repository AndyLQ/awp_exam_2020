import React, { Component } from "react";

class User extends Component {
  state = {};

  render() {
    return (
      <div className="container">
        <h3>Hello {localStorage.getItem("fullname")}</h3>
        <hr />
        <p>Your username is: {localStorage.getItem("username")}</p>
        <p>
          Your account was created - {localStorage.getItem("userCreateDate")}
        </p>
        {localStorage.getItem("admin") === "true" ? (
          <p>You are an admin</p>
        ) : (
          <p>You are not an admin </p>
        )}
      </div>
    );
  }
}

export default User;
