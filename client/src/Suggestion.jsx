import React, { Component } from "react";
import { Link } from "@reach/router";
import AddSignature from "./AddSignature";

class Suggestion extends Component {
  addSignature = (newSignature) => {
    console.log("This is the new signature: ", newSignature);
  };

  render() {
    const suggestion = this.props.getSuggestion(this.props.id);
    let content = <h3 className="container">Loading Suggestion...</h3>;
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

            <AddSignature addSignature={this.addSignature} />

            <br />

            <Link to="/">
              <button className="btn red darken-2">Go Back</button>
            </Link>
          </div>
        </>
      );
    }
    return content;
  }
}

export default Suggestion;
