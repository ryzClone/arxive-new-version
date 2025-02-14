import React from "react";
import { Outlet } from "react-router-dom";
import "../style/loginpage.css";
import myImg from "../img/login/background.jpg";
import EyeInvis from "../png/login-page/eyeivis.png";
import Eye from "../png/login-page/eye.png";
import Success from './SucsesFull';
import {BASE_URL} from "./base_url.jsx"


export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      showSuccess: false,
      Success: '',
      text:"",
      color: false,
    };
  }

  
  handleLoginChange = (e) => {
    this.setState({ login: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  togglePasswordVisibility = () => {
    const passwordInput = document.getElementById("inputPass");
    const eyeImage = document.getElementById("eyeClick");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeImage.src = Eye;
    } else {
      passwordInput.type = "password";
      eyeImage.src = EyeInvis;
    }
  };


  handleSubmit = (e) => {
    e.preventDefault();
    const username = this.state.login;
    const password = this.state.password;
    
    const data = {
      username,
      password,
    } 

    setTimeout(() => {
      this.setState({
        showSuccess: false,
      });
    }, 3000);

    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.token) {
          localStorage.setItem("jwtToken", data.data.token);
          localStorage.setItem("UserName", data.data.username);
          localStorage.setItem("Role", data.data.role);
          window.location.pathname = "/home";
        }else{
          console.log(data.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          text: "Username or Password wrong !!!",
          showSuccess:true,
          color:data.success,
        })
      });

      
      this.setState({
        showSuccess: '',
        Success: '',
      });

  };

  renderSuccessMessage() {
    if (this.state.showSuccess) {
      return (
        <Success title={this.state.text} background={this.state.color}/>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="wrapper">
        <div className="wrapperOpacity"></div>

        <div className="card-item">
          <div className="card-opacity"></div>
          <form action="" className="form" onSubmit={this.handleSubmit}>
            <h1 className="title">Welcome </h1>
            <input
              type="text"
              placeholder="Login"
              className="input"
              required
              value={this.state.login}
              onChange={this.handleLoginChange}
            />
            <div className="eyeInput">
              <input
                type="password"
                placeholder="Password"
                className="input"
                id="inputPass"
                required
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <img
                src={EyeInvis}
                alt=""
                id="eyeClick"
                className="eyeImg"
                onClick={this.togglePasswordVisibility}
              />
            </div>
            <input type="submit" value="Submit" className="submit" />
          </form>
          <img src={myImg} alt="" className="Img" />
        </div>
        {this.renderSuccessMessage()}
        <Outlet />
      </div>
    );
  }
}
