import React, { Component } from "react";
// import { navigate } from "@reach/router";

class AddSuggestions extends Component {
  state = {
    content: "",
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.content === "") {
      return;
    } else {
      this.props.addSuggestion(this.state);
      // navigate("/"); //DOES NOT UPDATE BROWER
      window.location = "/"; //DOES UPDATE BROWSER
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: this.Capitalize(e.target.value),
    });
  };

  render() {
    return (
      <div className="container">
        <h3>What is your new suggestion?</h3>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="What is your suggestion?"
            id="content"
            onChange={this.handleChange}
          />
          <button className="btn yellow darken-2">
            <i class="material-icons left">done</i>
            Submit your suggestion
          </button>
        </form>
      </div>
    );
  }
}

export default AddSuggestions;
