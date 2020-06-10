import React, { Component } from "react";
import { navigate } from "@reach/router";

class AddSignature extends Component {
  state = {
    name: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const searchName = this.props.data.filter(
      (name) => name.name === this.state.name
    );

    if (this.state.name === "") {
      return;
    } else if (this.state.name !== localStorage.getItem("username")) {
      alert("You have to sign in with your username");
      this.setState({
        name: "",
      });
      return;
    } else if (searchName.length !== 0) {
      alert("You have already signed this");
      this.setState({
        name: "",
      });
      return;
    } else {
      this.props.addSignature(this.state);
      this.setState({
        name: "",
      });
      alert("Thanks for signing the suggestion");
      window.location = "/";
      e.target.value = "";
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div className="">
        <form onSubmit={this.handleSubmit}>
          <label>Wanna support this suggestion?</label>
          <input
            type="text"
            placeholder="Sign with your username"
            id="name"
            onChange={this.handleChange}
            value={this.state.name}
            color="red"
          />
          <button className="btn yellow darken-2 ">
            <i class="material-icons left">create</i>Sign with signature
          </button>
        </form>
      </div>
    );
  }
}

export default AddSignature;
