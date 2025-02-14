import React, { Component } from 'react';
import "../style/Adduser.css";
import Select from 'react-select';
import Success from './SucsesFull';
import {BASE_URL} from "./base_url.jsx"


const status = [
  { value: true, label: 'Active' },
  { value: false, label: 'No active' },
];

class AddServce extends Component {
  constructor(props) {
    super(props);
    this.state = {
        serviceName: '',
        ip: '',
        port: '',
        username: '',
        groupname:'',
        status:'',
        password:'',
        priority:'',
        pathFolder:'',

        showSuccess: false,
        Success: '',
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

    const serviceName = this.state.serviceName;
    const ip = this.state.ip;
    const port = this.state.port;
    const pathFolder = this.state.pathFolder;
    const username = this.state.username;
    const password = this.state.password;
    const priority = this.state.priority;
    const status = this.state.status === "" ? true : this.state.status.value;

    const data = {
      serviceName,
      ip,
      port,
      pathFolder,
      username,
      password,
      priority,
      status,
    };
    
    fetch(`${BASE_URL}/service/add`, {
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
        serviceName: '',
        ip: '',
        port: '',
        pathFolder:'',
        username: '',
        password:'',
        priority: '',
        status:"",
        showSuccess: '',
        Success: '',
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

  handleStatus = (status) => {

    this.setState({ status }, () =>
      this.state.status.value
    );

  }

  componentDidMount = () => {
    if(localStorage.getItem('Role') === "ROLE_USER"){
      window.location.pathname = "/homes"
    }
  }

  TestConnection = () => {

    const serviceName = this.state.serviceName;
    const ip = this.state.ip;
    const port = this.state.port;
    const pathFolder = this.state.pathFolder;
    const username = this.state.username;
    const password = this.state.password;

    const data = {
      serviceName,
      ip,
      port,
      pathFolder,
      username,
      password,
    }

    fetch(`${BASE_URL}/service/test`, {
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

  }

  render() {
    return (
      <div className='add-user' id='Add-user'>

        <form onSubmit={this.handleSubmit} className='user-form'>

          <h1 className='user-title'>Add Service</h1>

            <input
              type='text'
              name='serviceName'
              value={this.state.serviceName}
              onChange={this.handleInputChange}
              className='user-input'
              placeholder='Service name'
              required
            />

            <input
              type='text'
              name='ip'
              value={this.state.ip}
              onChange={this.handleInputChange}
              className='user-input'
              placeholder='Ip'
              required
            />

          <input
            type='number'
            name='port'
            value={this.state.port}
            onChange={this.handleInputChange}
            className='user-input'
            placeholder='Port'
            required
          />

          <input
            type='text'
            name='pathFolder'
            value={this.state.pathFolder}
            onChange={this.handleInputChange}
            className='user-input'
            placeholder='Path Folder'
            required
          />  

          <input
            type='text'
            name='username'
            value={this.state.username}
            onChange={this.handleInputChange}
            className='user-input'
            placeholder='User name'
            required
          />

          <div className='PriorityBack'>
                    <input
                      type='password'
                      name='password'
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      className='user-input'
                      placeholder='Password'
                      required
                    />
                    <div className='PriorityBack-btn' onClick={this.TestConnection}>Test connection</div>

          </div>

          <input
            type='number'
            name='priority'
            value={this.state.priority}
            onChange={this.handleInputChange}
            className='user-input'
            placeholder='Priority'
          />


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

export default AddServce;
