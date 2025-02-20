import React from "react";
import { Outlet } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../style/loginpage.css";
import myImg from "../img/login/background.jpg";
import Success from "./SucsesFull";
import { BASE_URL } from "./base_url.jsx";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      showSuccess: false,
      text: "",
      color: false,
      showPassword: false,
    };
  }

  handleLoginChange = (e) => {
    this.setState({ login: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { login, password } = this.state;

    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: login, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.token) {
          localStorage.setItem("jwtToken", data.data.token);
          localStorage.setItem("UserName", data.data.username);
          localStorage.setItem("Role", data.data.role);
          window.location.pathname = "/home";
        } else {
          console.log(data.data.message);
        }
      })
      .catch(() => {
        this.setState({ text: "Username or Password wrong !!!", showSuccess: true, color: false });
      });
  };

  renderSuccessMessage() {
    return this.state.showSuccess ? <Success title={this.state.text} background={this.state.color} /> : null;
  }

  render() {
    return (
      <div className="wrapper">
        <div className="wrapperOpacity"></div>
        <div className="card-item">
          <div className="card-opacity"></div>
          <form className="form" onSubmit={this.handleSubmit}>
            <h1 className="title">Login</h1>
            <input type="text" placeholder="Login" className="input" required value={this.state.login} onChange={this.handleLoginChange} />
            <div className="eyeInput">
              <input type={this.state.showPassword ? "text" : "password"} placeholder="Password" className="input" required value={this.state.password} onChange={this.handlePasswordChange} />
              {this.state.showPassword ? (
                <FaEyeSlash className="eyeIcon" onClick={this.togglePasswordVisibility} />
              ) : (
                <FaEye className="eyeIcon" onClick={this.togglePasswordVisibility} />
              )}
            </div>
            <input type="submit" value="Submit" className="submit" />
          </form>
          <img src={myImg} alt="Background" className="Img" />
        </div>
        {this.renderSuccessMessage()}
        <Outlet />
      </div>
    );
  }
}
