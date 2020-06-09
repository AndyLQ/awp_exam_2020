import React, { Component } from "react";

class AddSignature extends Component {
  state = {
    name: "",
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.name === "") {
      return;
    } else {
      // console.log(this.state);
      this.props.addSignature(this.state);
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
          />
          <button className="btn yellow darken-2">Sign with signature</button>
        </form>
      </div>
    );
  }
}

export default AddSignature;
