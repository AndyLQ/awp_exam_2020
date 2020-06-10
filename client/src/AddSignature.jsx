import React, { Component } from "react";

class AddSignature extends Component {
  state = {
    name: "",
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  handleSubmit = (e) => {
    // e.preventDefault();
    if (this.state.name === "") {
      return;
    } else {
      this.props.addSignature(this.state);
      this.setState({
        name: "",
      });
      e.target.value = "";
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: this.Capitalize(e.target.value),
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
