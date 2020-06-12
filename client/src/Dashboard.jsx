import React, { Component } from "react";

class Dashboard extends Component {
  state = {};
  render() {
    const suggestions = this.props.suggestions.map((suggestion) => (
      <div className="card">
        <div className="card-content">
          <h5>{suggestion.content}</h5>
          <p>{suggestion.body}</p>
          <br />
          <span className="grey-text">
            Posted by: {suggestion.uploadUser} / {suggestion.uploadFullname}
          </span>
          <br />
          <span className="grey-text">{suggestion.date}</span>
          <br />
          <span className="grey-text">
            Signatures: <span> </span>
            {suggestion.signatures.length}
          </span>
          <br />
          <br />
          <button className="btn yellow darken-2">
            <i class="material-icons left">delete_forever</i>
            DELETE USER
          </button>
        </div>
      </div>
    ));

    const users = this.props.users.map((user) => (
      <div className="card">
        <div className="card-content">
          <h5>{user.fullname}</h5>
          <p>Username: {user.username}</p>
          <span className="grey-text">Created on: {user.dateCreated}</span>
          <br />
          <span className="grey-text">User is admin: {user.admin}</span>
        </div>
      </div>
    ));
    return (
      <div className="container">
        <h3>Admin Dashboard</h3>
        <p>Suggestions:</p>
        {suggestions}
        <br />
        <br />
        <p>Users:</p>
        {users}
      </div>
    );
  }
}

export default Dashboard;
