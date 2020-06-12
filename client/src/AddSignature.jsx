import React, { Component } from "react";

class AddSignature extends Component {
  state = {
    fullname: "",
    username: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const searchName = this.props.data.filter(
      (name) => name.name === localStorage.getItem("username")
    );

    if (this.state.fullname === "") {
      return;
    } else if (this.state.fullname !== localStorage.getItem("fullname")) {
      alert("You have to sign in with your full name");
      this.setState({
        fullname: "",
      });
      return;
    } else if (searchName.length !== 0) {
      alert("You have already signed this");
      this.setState({
        fullname: "",
      });
      return;
    } else {
      const name = localStorage.getItem("username");
      const fullname = localStorage.getItem("fullname");
      this.props.addSignature(name, fullname);
      this.setState({
        fullname: "",
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
            placeholder="Sign with your FULL NAME"
            id="fullname"
            onChange={this.handleChange}
            value={this.state.fullname}
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
