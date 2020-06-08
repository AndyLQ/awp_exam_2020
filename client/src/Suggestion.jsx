import React, { Component } from "react";
import { Link } from "@reach/router";

class Suggestion extends Component {
  render() {
    console.log(this.props.getSuggestion(this.props.id));
    const suggestion = this.props.getSuggestion(this.props.id);
    let content = <p>Loading</p>;
    if (suggestion) {
      content = (
        <>
          <div className="container">
            <h3>{suggestion.content}</h3>
            <hr className="text-blue darken-1"></hr>
            <h5>Signatures:</h5>
            <ul className="collection">
              {suggestion.signatures.map((signature) => (
                <li className="collection-item" key={signature.name}>
                  {signature.name}
                </li>
              ))}
            </ul>

            <Link to="/">
              <button className="btn yellow darken-2">Back</button>
            </Link>
          </div>
        </>
      );
    }
    return content;
  }
}

export default Suggestion;
