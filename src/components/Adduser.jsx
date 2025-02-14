import React, { Component } from 'react';
import "../style/Adduser.css";
import Select from 'react-select';
import Success from './SucsesFull';
import {BASE_URL} from "./base_url.jsx"



const role = [
  { value: 'ROLE_USER', label: 'User' },
  { value: 'ROLE_ADMIN', label: 'Admin' },
  { value: 'ROLE_MODERATOR', label: 'Moderator' },
];

const status = [
  { value: true, label: 'Active' },
  { value: false, label: 'No active' },
];

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
        lastName: '',
        firstName: '',
        userName: '',
        password: '',
        showSuccess: false,
        Success: '',
        status:"",
        role:"",
        text:"",
        color: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.setState({
        showSuccess: false,
      });
      window.location.reload();
    }, 3000);
    
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const username = this.state.userName;
    const password = this.state.password;
    const role = this.state.role === '' ? "ROLE_USER" : this.state.role.value;
    const status = this.state.status === '' ? true : this.state.status.value;

    const data = {
      firstName,
      lastName,
      username,
      password,
      role,
      status,
    };

    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        
        this.setState({
          text: data.message,
          showSuccess:true,
          color:data.success,
        })
      
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });

      this.setState({
        lastName: '',
        firstName: '',
        userName: '',
        password: '',
        showSuccess: '',
        Success: '',
        status:"Active",
        role:"ROLE_User",
      });

  };

   getAccessToken = () => {
    return localStorage.getItem("jwtToken");
  };


  handleInputChange = (event) => {
    const inputName = event.target.name;
    this.setState({ [inputName]: event.target.value });
  };

  renderSuccessMessage() {
    if (this.state.showSuccess) {
      return (
        <Success title={this.state.text} background={this.state.color}/>
      );
    }
    return null;
  }

  handleChange = (role) => {
    this.setState({ role }, () =>
      this.state.role
    );
  };

  handleStatus = (status) => {

    this.setState({ status }, () =>
      this.state.status
    );

  }

  componentDidMount = () => {
    if(localStorage.getItem('Role') === "ROLE_USER"){
      window.location.pathname = "/homes"
    }
  }

  render() {
    return (
      <div className='add-user' id='Add-user'>

        <form onSubmit={this.handleSubmit} className='user-form'>

          <h1 className='user-title'>Add User</h1>

          <div className='name'>
            <input
              type='text'
              name='firstName'
              value={this.state.firstName}
              onChange={this.handleInputChange}
              className='user-input'
              placeholder='Firstname'
              required
            />

            <input
              type='text'
              name='lastName'
              value={this.state.lastName}
              onChange={this.handleInputChange}
              className='user-input'
              placeholder='Lastname'
              required
            />
          </div>

          <input
            type='text'
            name='userName'
            value={this.state.userName}
            onChange={this.handleInputChange}
            className='user-input'
            placeholder='Username'
            required
          />

          <input
            type='password'
            name='password'
            value={this.state.password}
            onChange={this.handleInputChange}
            className='user-input'
            placeholder='password'
            required
          />

          <Select value={this.state.role} onChange={this.handleChange} options={role} className='user-select-modal' />

          <Select value={this.state.status} onChange={this.handleStatus} options={status} className='user-select-modal' />


          <button type='submit' className='user-btn'>
            Submit
          </button>
        </form>

        {this.renderSuccessMessage()}
      </div>
    );
  }
}

export default AddUser;
