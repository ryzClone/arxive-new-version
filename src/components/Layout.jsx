import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import "../style/layout.css";
import Logo from "../img/section/logo1.ico";
import Transfer from "../png/section/aside/transfer.png";
import Home from "../png/section/aside/home.png";
import AddUser from "../png/section/aside/addUser.png";
import Eng from "../png/section/aside/Eng.png";
import Rus from "../png/section/aside/rus.png";
import Uzb from "../png/section/aside/uzb.png";
import Group from "../png/section/aside/group.png";
import Joingroup from "../png/section/aside/joingroup.png";
import Service from "../png/section/aside/service.png";
import History from "../png/section/aside/history.png";
import search from "../png/section/aside/search-black.png";
import contracts from "../png/section/aside/document-files.png";


// FontAwesome ikonkalarini import qilamiz
import { FaUserCircle } from "react-icons/fa";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      hamburger: "flex",
      isDisplayed: false,
      language: Eng,
      activeLink: window.location.pathname,
      profileDropdown: false, // Profile dropdownni boshqarish
      languageDropdown: false,
    };
    this.RemoteLanguage = this.RemoteLanguage.bind(this);
    this.profileDropdownRef = React.createRef();
    this.languageDropdownRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  
  handleInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  Hamburger = () => {
    const DropdownAll = document.querySelectorAll(".linkText");
    const LogoIten = document.querySelector(".logo-item");
    const Logo = document.querySelector(".logo");
    const wrappers = document.querySelector(".wrappers");
    const NavBar = document.getElementById("navbar-body");

    DropdownAll.forEach((element) => {
      if (element.style.display === "") {
        element.style.display = "none";
        LogoIten.style.display = "none";
        Logo.style.justifyContent = "center";
        wrappers.style.width = "75px";
        wrappers.style.minWidth = "60px";
        NavBar.style.marginLeft = "60px";
      } else {
        element.style.display = "";
        LogoIten.style.display = "flex";
        Logo.style.justifyContent = "flex-start";
        wrappers.style.width = "17%";
        wrappers.style.minWidth = "15%";
        NavBar.style.marginLeft = "15%";
      }
    });
  };

  handleToggleDisplay = () => {
    this.setState((prevState) => ({
      isDisplayed: !prevState.isDisplayed,
    }));
  };

  toggleProfileDropdown = () => {
    this.setState((prevState) => ({
      profileDropdown: !prevState.profileDropdown,
    }));
  };

  toggleLanguageDropdown = () => {
    this.setState((prevState) => ({
      languageDropdown: !prevState.languageDropdown,
    }));
  };

  RemoteLanguage(e) {
    const imgSrc = e.currentTarget.querySelector("img").src;
    this.setState({
      language: imgSrc,
      isDisplayed: false,
    });
  }

  componentDidMount() {
    if (!window.localStorage.getItem("jwtToken")) {
      window.location.pathname = "/";
    }

    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (
      this.profileDropdownRef &&
      !this.profileDropdownRef.current.contains(e.target)
    ) {
      this.setState({ profileDropdown: false });
    }
  
    if (
      this.languageDropdownRef &&
      !this.languageDropdownRef.current.contains(e.target)
    ) {
      this.setState({ languageDropdown: false });
    }
  }
  

  clearLocalstorage = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("UserName");
    localStorage.removeItem("Role");
  };

  setActiveLink = (link) => {
    this.setState({ activeLink: link });
  };
  

  render() {
    const { profileDropdown, activeLink, languageDropdown } =
      this.state;

    return (
      <div className="block">
        <div className="wrappers">
          <div className="logo">
            <div className="logo-photo">
              <img
                src={Logo}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "5px",
                  backgroundSize: "cover",
                }}
              />
            </div>

            <div className="logo-item">
              <div className="logo-item-title">Swift Transfer</div>
              <div className="logo-item-text">версии: 1.0.1</div>
            </div>
          </div>

          <div className="dropdown">
            <Link
              to="/home"
              className={`link ${activeLink === "/home" ? "isActive" : ""}`}
              title="Home"
              onClick={() => this.setActiveLink("/home")}
            >
              <img
                src={Home}
                alt="Home"
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Home</div>
            </Link>

            <Link
              to="/home/readuser"
              className={`link ${
                activeLink === "/home/readuser" ? "isActive" : ""
              }`}
              title="Add-User"
              style={{
                display: localStorage.Role === "ROLE_ADMIN" ? "flex" : "none",
              }}
              onClick={() => this.setActiveLink("/home/readuser")}
            >
              <img
                src={AddUser}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">User</div>
            </Link>

            <Link
              to="/home/transfer"
              className={`link ${
                activeLink === "/home/transfer" ? "isActive" : ""
              }`}
              title="Transfer"
              style={{
                display: localStorage.Role === "ROLE_ADMIN" ? "flex" : "none",
              }}
              onClick={() => this.setActiveLink("/home/transfer")}
            >
              <img
                src={Transfer}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Transfer</div>
            </Link>

            <Link
              to="/home/group"
              className={`link ${
                activeLink === "/home/group" ? "isActive" : ""
              }`}
              title="Group"
              style={{
                display: localStorage.Role === "ROLE_ADMIN" ? "flex" : "none",
              }}
              onClick={() => this.setActiveLink("/home/group")}
            >
              <img
                src={Group}
                alt="Group"
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Group</div>
            </Link>

            <Link
              to="/home/service"
              className={`link ${
                activeLink === "/home/service" ? "isActive" : ""
              }`}
              title="Service"
              style={{
                display: localStorage.Role === "ROLE_ADMIN" ? "flex" : "none",
              }}
              onClick={() => this.setActiveLink("/home/service")}
            >
              <img
                src={Service}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Service</div>
            </Link>

            <Link
              to="/home/joingroup"
              className={`link ${
                activeLink === "/home/joingroup" ? "isActive" : ""
              }`}
              title="JoinGroup"
              style={{
                display: localStorage.Role === "ROLE_ADMIN" ? "flex" : "none",
              }}
              onClick={() => this.setActiveLink("/home/joingroup")}
            >
              <img
                src={Joingroup}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Join Group</div>
            </Link>

            <Link
              to="/home/search"
              className={`link ${
                activeLink === "/home/search" ? "isActive" : ""
              }`}
              title="Search"
              onClick={() => this.setActiveLink("/home/search")}
            >
              <img
                src={search}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Search</div>
            </Link>

            <Link
              to="/home/contracts"
              className={`link ${
                activeLink === "/home/contracts" ? "isActive" : ""
              }`}
              title="Contracts"
              onClick={() => this.setActiveLink("/home/contracts")}
            >
              <img
                src={contracts}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">Contracts</div>
            </Link>

            <Link
              to="/home/history"
              className={`link ${
                activeLink === "/home/history" ? "isActive" : ""
              }`}
              title="History"
              style={{
                display: localStorage.Role === "ROLE_ADMIN" ? "flex" : "none",
              }}
              onClick={() => this.setActiveLink("/home/history")}
            >
              <img
                src={History}
                alt=""
                style={{
                  width: "25px",
                  height: "25px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <div className="linkText">History</div>
            </Link>
          </div>
        </div>

        <div className="navbar" id="navbar-body">
          <div className="nav-item">
            <div className="menuToggle" onClick={this.Hamburger}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="right-body">

              <div className="language" ref={this.languageDropdownRef}>
                <div className="language-always">
                  <img
                    src={this.state.language}
                    alt="Language"
                    className="language-icon"
                    onClick={this.toggleLanguageDropdown}
                  />
                </div>
                {languageDropdown && (
                  <div className="language-dropdown">
                    <li onClick={this.RemoteLanguage}>
                      <img src={Eng} alt="" className="language-img" />
                      <p>English</p>
                    </li>
                    <li onClick={this.RemoteLanguage}>
                      <img src={Rus} alt="" className="language-img" />
                      <p>Russian</p>
                    </li>
                    <li onClick={this.RemoteLanguage}>
                      <img src={Uzb} alt="" className="language-img" />
                      <p>Uzbek</p>
                    </li>
                  </div>
                )}
              </div>

              <div className="profile" ref={this.profileDropdownRef}>
                <FaUserCircle
                  size={30}
                  onClick={this.toggleProfileDropdown}
                  style={{ cursor: "pointer" }}
                  className="profile-pic"
                />
                {profileDropdown && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <FaUserCircle
                        size={30}
                        onClick={this.toggleProfileDropdown}
                        style={{ cursor: "pointer" }}
                        className="dropdown-profile-pic"
                      />
                      <div className="profile-info">
                        <p className="profile-name">
                          Username: {localStorage.getItem("UserName")}
                        </p>
                        <p className="profile-email">
                          Role:
                          {localStorage.getItem("Role") === "ROLE_ADMIN"
                            ? "Admin"
                            : "User"}
                        </p>
                      </div>
                    </div>
                    <Link to="/home/profile" className="dropdown-item">
                      My Profile
                    </Link>
                    <Link
                      to="/"
                      className="dropdown-item logout"
                      onClick={this.clearLocalstorage}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="nav-body">
            <Outlet />
          </div>
        </div>

      </div>
    );
  }
}

export default Layout;
