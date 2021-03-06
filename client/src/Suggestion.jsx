import React, { Component } from "react";
import { Link } from "@reach/router";
import AddSignature from "./AddSignature";

class Suggestion extends Component {
  addSignature = (name, fullname) => {
    const suggestionId = this.props.getSuggestion(this.props.id);
    this.props.addSignature(name, fullname, suggestionId._id);
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

    let signatures = (
      <div>
        <h5>Signatures:</h5>
        <ul className="collection">
          {suggestion.signatures.map((signature) => (
            <li className="collection-item" key={signature.name}>
              {signature.fullname}
              {localStorage.getItem("admin") === "true" ? (
                <span className="grey-text"> - Username: {signature.name}</span>
              ) : null}

              <span className="right">{signature.date}</span>
            </li>
          ))}
        </ul>
      </div>
    );

    if (suggestion) {
      content = (
        <>
          <div className="container">
            <h3>{suggestion.content}</h3>
            <h6>{suggestion.body}</h6>
            <br />
            <h6 className="grey-text text-darken-2">
              Uploaded by: {suggestion.uploadUser} - {suggestion.date}
            </h6>
            <hr />
            {suggestion.signatures.length !== 0 ? (
              signatures
            ) : (
              <p>Be the first one to sign this suggestion!</p>
            )}
            {this.props.isloggedContent ? (
              <AddSignature
                addSignature={this.addSignature}
                data={suggestion.signatures}
              />
            ) : (
              <p>
                <b>Login to sign this suggestion</b>
              </p>
            )}
            <br />
            {this.props.isloggedContent ? null : (
              <div>
                <Link to="/login">
                  <button className="btn yellow darken-2">
                    <i class="material-icons left">arrow_forward</i>GO TO LOGIN
                  </button>
                </Link>
                <br />
                <br />
              </div>
            )}
            <Link to="/">
              <button className="btn red darken-2">
                <i class="material-icons left">arrow_back</i>GO BACK
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
