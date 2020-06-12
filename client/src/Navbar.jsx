import React, { Component } from "react";
import { Link } from "@reach/router";

class Navbar extends Component {
  state = {
    username: "",
    user: "",
  };

  render() {
    return (
      <nav className="nav-wrapper yellow darken-3">
        <div className="container">
          <Link to="/" className="brand-logo">
            WhatOnYourMind
          </Link>
          <ul className="right">
            <li>
              <Link to="/">Suggestions</Link>
            </li>

            {this.props.isloggedContent ? (
              <li>
                <Link to="/add-suggestion">Add Suggestion</Link>
              </li>
            ) : null}

            {this.props.isloggedContent ? (
              <li>
                <Link to="/user">Profile</Link>
              </li>
            ) : null}

            {this.props.isloggedContent ? null : (
              <li>
                <Link to="/register">Register</Link>
              </li>
            )}

            {this.props.isloggedContent ? (
              <li onClick={() => this.props.logout()}>
                <a>Log out</a>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
