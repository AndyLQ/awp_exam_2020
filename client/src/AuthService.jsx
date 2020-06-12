class AuthService {
  constructor(auth_api_url) {
    this.auth_api_url = auth_api_url;
  }

  async login(username, password) {
    console.log(this.auth_api_url);
    const res = await this.fetch(this.auth_api_url, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    let json = await res.json();

    if ([401, 404].includes(parseInt(res.status))) {
      console.log("Did not manage to login");
      throw Error(json.msg);
    }
    this.setToken(json.token);
    this.setUsername(username);
    return json;
  }

  loggedIn() {
    return this.getToken() !== null;
  }

  isAdmin() {
    return this.getAdmin() !== false;
  }

  getAdmin() {
    return localStorage.getItem("admin");
  }

  setToken(token) {
    console.log("Token passed to localStorage");
    localStorage.setItem("token", token);
  }

  setUsername(username) {
    localStorage.setItem("username", username);
  }

  getUsername() {
    return localStorage.getItem("username");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    console.log("Logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");
    localStorage.removeItem("id");
    localStorage.removeItem("userCreateDate");
    localStorage.removeItem("admin");
  }

  fetch(url, options) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    });
  }
}

export default AuthService;
