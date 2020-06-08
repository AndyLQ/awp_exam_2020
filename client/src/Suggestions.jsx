import React, { Component } from "react";
import { Link } from "@reach/router";

class Suggestions extends Component {
  render() {
    const suggestions = this.props.suggestions.map((suggestion) => (
      <li className="collection-item" key={suggestion._id}>
        <Link to={`/suggestion/${suggestion._id}`}>{suggestion.content}</Link>
      </li>
    ));
    return (
      <>
        <div className="container">
          <h3>Suggestions</h3>
          <ol className="collection">{suggestions}</ol>
        </div>
      </>
    );
  }
}

export default Suggestions;
