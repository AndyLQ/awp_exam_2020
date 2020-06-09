import React, { Component } from "react";
import { Link } from "@reach/router";
import AddSignature from "./AddSignature";

class Suggestion extends Component {
  addSignature = (newSignature) => {
    const suggestionId = this.props.getSuggestion(this.props.id);
    this.props.addSignature(newSignature, suggestionId._id);
  };

  render() {
    const suggestion = this.props.getSuggestion(this.props.id);
    let content = (
      <div className="container">
        <br />
        <div class="progress">
          <div class="indeterminate yellow darken-2"></div>
        </div>
      </div>
    );
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
                  <span className="right">{signature.date}</span>
                </li>
              ))}
            </ul>

            <AddSignature addSignature={this.addSignature} />

            <br />

            <Link to="/">
              <button className="btn red darken-2">
                <i class="material-icons left">arrow_back</i>Go Back
              </button>
            </Link>
          </div>
        </>
      );
    }
    return content;
  }
}

export default Suggestion;
