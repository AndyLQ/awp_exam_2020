import React, { Component } from "react";
import { Link } from "@reach/router";

class Navbar extends Component {
  state = {};

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
            <li>
              <Link to="/add-suggestion">Add Suggestion</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
